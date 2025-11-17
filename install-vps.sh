#!/bin/bash

# ============================================================
# GlobalNet VPS Installation Script
# ============================================================
# Installation sur: /opt/apps/globalnet
# Domaine: globalnet
# IP: 168.231.84.168
# Protocol: HTTPS (Let's Encrypt)
# ============================================================

set -e

echo "🚀 Starting GlobalNet VPS Installation..."

# Variables
APP_DIR="/opt/apps/globalnet"
DOMAIN="globalnet"
IP="168.231.84.168"
NODE_VERSION="18"
APP_PORT="3000"
NGINX_PORT="443"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# ============================================================
# 1. SYSTEM UPDATES
# ============================================================
echo -e "${YELLOW}[1/10]${NC} Updating system packages..."
sudo apt update
sudo apt upgrade -y
sudo apt install -y curl wget git build-essential

# ============================================================
# 2. NODE.JS & NPM
# ============================================================
echo -e "${YELLOW}[2/10]${NC} Installing Node.js ${NODE_VERSION}..."
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
sudo apt install -y nodejs

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# ============================================================
# 3. POSTGRESQL
# ============================================================
echo -e "${YELLOW}[3/10]${NC} Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl enable postgresql
sudo systemctl start postgresql

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE cleaning_app;
CREATE USER globalnet_user WITH ENCRYPTED PASSWORD 'CHANGE_ME_SECURE_PASSWORD';
ALTER ROLE globalnet_user SET client_encoding TO 'utf8';
ALTER ROLE globalnet_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE globalnet_user SET default_transaction_deferrable TO on;
ALTER ROLE globalnet_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE cleaning_app TO globalnet_user;
EOF

echo -e "${GREEN}✓ PostgreSQL configured${NC}"

# ============================================================
# 4. CREATE APP DIRECTORY
# ============================================================
echo -e "${YELLOW}[4/10]${NC} Creating application directory..."
sudo mkdir -p ${APP_DIR}
sudo chown -R $USER:$USER ${APP_DIR}

# ============================================================
# 5. CLONE/SETUP PROJECT
# ============================================================
echo -e "${YELLOW}[5/10]${NC} Setting up GlobalNet project..."
cd ${APP_DIR}

# Clone from git (update with your repo)
# git clone <your-repo-url> .
# OR copy from local
echo "Please copy your GlobalNet project to ${APP_DIR}"
echo "Then run: npm install"

# ============================================================
# 6. NGINX INSTALLATION
# ============================================================
echo -e "${YELLOW}[6/10]${NC} Installing Nginx..."
sudo apt install -y nginx

# Stop nginx for Let's Encrypt setup
sudo systemctl stop nginx

# ============================================================
# 7. CERTBOT (Let's Encrypt)
# ============================================================
echo -e "${YELLOW}[7/10]${NC} Installing Certbot for HTTPS..."
sudo apt install -y certbot python3-certbot-nginx

# Request SSL certificate
echo "Requesting SSL certificate for domain: ${DOMAIN}"
sudo certbot certonly --standalone \
  -d ${DOMAIN} \
  --non-interactive \
  --agree-tos \
  --email admin@${DOMAIN} \
  --rsa-key-size 4096

echo -e "${GREEN}✓ SSL certificate installed${NC}"

# ============================================================
# 8. NGINX CONFIGURATION
# ============================================================
echo -e "${YELLOW}[8/10]${NC} Configuring Nginx..."

# Create Nginx config
sudo tee /etc/nginx/sites-available/globalnet > /dev/null << 'EOF'
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name globalnet;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name globalnet;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/globalnet/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/globalnet/privkey.pem;

    # SSL Security Headers
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;
    gzip_vary on;

    # Proxy settings
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_redirect off;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/globalnet /etc/nginx/sites-enabled/globalnet
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Start Nginx
sudo systemctl enable nginx
sudo systemctl start nginx

echo -e "${GREEN}✓ Nginx configured${NC}"

# ============================================================
# 9. SYSTEMD SERVICE
# ============================================================
echo -e "${YELLOW}[9/10]${NC} Creating systemd service..."

sudo tee /etc/systemd/system/globalnet.service > /dev/null << EOF
[Unit]
Description=GlobalNet Node.js Application
After=network.target postgresql.service

[Service]
Type=simple
User=$USER
WorkingDirectory=${APP_DIR}
Environment="NODE_ENV=production"
Environment="DATABASE_URL=postgresql://globalnet_user:CHANGE_ME_SECURE_PASSWORD@localhost:5432/cleaning_app"
Environment="NEXTAUTH_SECRET=CHANGE_ME_RANDOM_SECRET_32_CHARS"
Environment="NEXTAUTH_URL=https://globalnet"
ExecStart=$(which node) node_modules/.bin/next start -p 3000
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable globalnet

echo -e "${GREEN}✓ Systemd service configured${NC}"

# ============================================================
# 10. SETUP & ENV
# ============================================================
echo -e "${YELLOW}[10/10]${NC} Final setup steps..."

echo ""
echo -e "${YELLOW}=== INSTALLATION COMPLETE ===${NC}"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "1. Update database password:"
echo "   - ${APP_DIR}/.env"
echo "   - /etc/systemd/system/globalnet.service"
echo ""
echo "2. Generate NEXTAUTH_SECRET:"
echo "   npx ts-node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
echo ""
echo "3. Install dependencies:"
echo "   cd ${APP_DIR}"
echo "   npm install"
echo ""
echo "4. Build the project:"
echo "   npm run build"
echo ""
echo "5. Run migrations:"
echo "   npx prisma migrate deploy"
echo ""
echo "6. Start the service:"
echo "   sudo systemctl start globalnet"
echo ""
echo "7. Check status:"
echo "   sudo systemctl status globalnet"
echo "   journalctl -u globalnet -f"
echo ""
echo -e "${YELLOW}SSL Certificate Info:${NC}"
echo "   Location: /etc/letsencrypt/live/globalnet/"
echo "   Auto-renewal: Enabled via Certbot"
echo ""
echo -e "${YELLOW}DNS Configuration:${NC}"
echo "   A globalnet 300 168.231.84.168"
echo ""

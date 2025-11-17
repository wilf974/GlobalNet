# 🚀 GlobalNet VPS Installation Guide

## Configuration VPS
- **Domain**: globalnet
- **IP**: 168.231.84.168
- **Installation Path**: `/opt/apps/globalnet`
- **Protocol**: HTTPS (Let's Encrypt)
- **Application Port**: 3000 (internal)
- **Nginx Port**: 443 (HTTPS)

---

## 📋 Prerequisites

### 1. DNS Configuration

Ajoutez ce record DNS chez votre registrar:

```
Type: A
Name: globalnet
Value: 168.231.84.168
TTL: 300
```

⏳ Attendez 10-15 minutes que le DNS se propage

### 2. SSH Access to VPS

```bash
ssh root@168.231.84.168
# ou si vous avez un utilisateur spécifique:
ssh user@168.231.84.168
```

---

## 🔧 Installation Steps

### Step 1: Connect to VPS and Update System

```bash
ssh root@168.231.84.168

# Update system packages
sudo apt update
sudo apt upgrade -y
sudo apt install -y curl wget git build-essential
```

### Step 2: Install Node.js 18 LTS

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node -v  # Should be v18.x.x
npm -v   # Should be 9.x.x
```

### Step 3: Install PostgreSQL

```bash
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl enable postgresql
sudo systemctl start postgresql

# Create database and user
sudo -u postgres psql << 'EOF'
CREATE DATABASE cleaning_app;
CREATE USER globalnet_user WITH ENCRYPTED PASSWORD 'your_secure_password_here';
ALTER ROLE globalnet_user SET client_encoding TO 'utf8';
ALTER ROLE globalnet_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE globalnet_user SET default_transaction_deferrable TO on;
ALTER ROLE globalnet_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE cleaning_app TO globalnet_user;
EOF

# Test connection
psql -U globalnet_user -d cleaning_app -h localhost -c "SELECT version();"
```

### Step 4: Create Application Directory

```bash
sudo mkdir -p /opt/apps/globalnet
sudo chown -R $USER:$USER /opt/apps/globalnet

cd /opt/apps/globalnet
```

### Step 5: Clone/Copy Project

**Option A: Clone from Git**
```bash
cd /opt/apps/globalnet
git clone <your-repo-url> .
```

**Option B: From Local Machine (Recommended)**
```bash
# From your local machine:
scp -r ~/GlobalNet/* root@168.231.84.168:/opt/apps/globalnet/

# Or using rsync (faster for large files):
rsync -avz --delete ~/GlobalNet/ root@168.231.84.168:/opt/apps/globalnet/
```

### Step 6: Install Dependencies

```bash
cd /opt/apps/globalnet

npm install

# Verify installation
npm list @prisma/client next react
```

### Step 7: Install Nginx

```bash
sudo apt install -y nginx

# Stop nginx temporarily for SSL setup
sudo systemctl stop nginx
```

### Step 8: Setup SSL Certificate (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx

# Request certificate (will wait for DNS propagation)
sudo certbot certonly --standalone \
  -d globalnet \
  --non-interactive \
  --agree-tos \
  --email admin@globalnet \
  --rsa-key-size 4096

# Verify certificate
sudo ls -la /etc/letsencrypt/live/globalnet/
```

### Step 9: Configure Nginx

```bash
# Create Nginx configuration
sudo tee /etc/nginx/sites-available/globalnet > /dev/null << 'NGINX_EOF'
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

    # SSL Security
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

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/json application/xml;
    gzip_vary on;

    # Proxy to Node.js
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
    }

    # Cache static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
NGINX_EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/globalnet /etc/nginx/sites-enabled/globalnet
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Start Nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### Step 10: Configure Environment Variables

```bash
cd /opt/apps/globalnet

# Copy .env.production to .env
cp .env.production .env

# Generate NEXTAUTH_SECRET
NEXTAUTH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET"

# Edit .env with your values
nano .env
# Replace:
# - DATABASE_URL with your PostgreSQL credentials
# - NEXTAUTH_SECRET with the generated value
# - NEXTAUTH_URL keep as https://globalnet
```

### Step 11: Build & Migrate Database

```bash
cd /opt/apps/globalnet

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Optional: Seed test data
# npx prisma db seed

# Build Next.js
npm run build

# Verify build
ls -la .next/
```

### Step 12: Create Systemd Service

```bash
sudo tee /etc/systemd/system/globalnet.service > /dev/null << 'SERVICE_EOF'
[Unit]
Description=GlobalNet Next.js Application
After=network.target postgresql.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/apps/globalnet
Environment="NODE_ENV=production"
EnvironmentFile=/opt/apps/globalnet/.env
ExecStart=/usr/bin/node /opt/apps/globalnet/node_modules/.bin/next start -p 3000
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
SERVICE_EOF

# Reload systemd
sudo systemctl daemon-reload

# Enable service to start on boot
sudo systemctl enable globalnet

# Start service
sudo systemctl start globalnet

# Check status
sudo systemctl status globalnet
```

### Step 13: Verify Installation

```bash
# Check service status
sudo systemctl status globalnet

# View logs
sudo journalctl -u globalnet -f

# Check Nginx
sudo systemctl status nginx

# Test application
curl https://localhost/  # Should return HTML

# Check SSL certificate
sudo certbot certificates
```

---

## 📊 Post-Installation

### Monitor Application

```bash
# Real-time logs
sudo journalctl -u globalnet -f

# View recent logs
sudo journalctl -u globalnet -n 50

# Database check
psql -U globalnet_user -d cleaning_app -h localhost -c "SELECT COUNT(*) FROM \"Organization\";"
```

### Update Application

```bash
cd /opt/apps/globalnet

# Pull latest code
git pull origin main

# Install new dependencies
npm install

# Build
npm run build

# Run migrations
npx prisma migrate deploy

# Restart service
sudo systemctl restart globalnet
```

### SSL Certificate Renewal

```bash
# Certbot auto-renewal (already enabled)
sudo systemctl status certbot.timer

# Manual renewal test
sudo certbot renew --dry-run

# Manual renewal
sudo certbot renew
```

### Backup Database

```bash
# Daily backup script
sudo tee /usr/local/bin/backup-globalnet.sh > /dev/null << 'BACKUP_EOF'
#!/bin/bash
BACKUP_DIR="/opt/backups/globalnet"
mkdir -p $BACKUP_DIR
DATE=$(date +%Y%m%d_%H%M%S)
sudo -u postgres pg_dump cleaning_app | gzip > $BACKUP_DIR/cleaning_app_$DATE.sql.gz
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete
BACKUP_EOF

sudo chmod +x /usr/local/bin/backup-globalnet.sh

# Add to crontab
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-globalnet.sh
```

---

## 🔒 Security Checklist

```bash
# 1. Firewall configuration
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 2. Fail2ban (optional)
sudo apt install -y fail2ban
sudo systemctl enable fail2ban

# 3. SSH hardening (optional)
sudo nano /etc/ssh/sshd_config
# Change PermitRootLogin to 'no'
# Change PasswordAuthentication to 'no'
sudo systemctl restart sshd

# 4. Regular updates
sudo apt update && sudo apt upgrade -y
```

---

## 🆘 Troubleshooting

### Application not starting

```bash
# Check logs
sudo journalctl -u globalnet -n 100

# Check port
sudo netstat -tlnp | grep 3000

# Check database connection
psql -U globalnet_user -d cleaning_app -h localhost -c "\dt"

# Check Nginx
sudo nginx -t
```

### SSL certificate issues

```bash
# Check certificate
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Check certificate files
ls -la /etc/letsencrypt/live/globalnet/
```

### Database connection issues

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql

# Test connection
psql -U globalnet_user -d cleaning_app -h localhost -c "SELECT 1;"
```

---

## 📞 Support

For issues or questions about the installation, check:
- Application logs: `sudo journalctl -u globalnet -f`
- Nginx logs: `/var/log/nginx/error.log`
- PostgreSQL logs: `/var/log/postgresql/`

---

**Installation Date**: 2025-11-17
**Next Steps**: Configure additional services (email, monitoring, backups)

# ⚡ GlobalNet Quick Deployment Commands

## 🚀 One-Click Installation (Copy-Paste These Commands)

### 1️⃣ Connect to VPS
```bash
ssh root@168.231.84.168
```

### 2️⃣ System Setup (Run All At Once)
```bash
# Update system
sudo apt update && sudo apt upgrade -y && sudo apt install -y curl wget git build-essential

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable postgresql && sudo systemctl start postgresql
```

### 3️⃣ Database Setup
```bash
# Replace 'your_secure_password_here' with a strong password
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
psql -U globalnet_user -d cleaning_app -h localhost -c "SELECT 1;"
```

### 4️⃣ Application Setup
```bash
# Create app directory
sudo mkdir -p /opt/apps/globalnet
sudo chown -R $USER:$USER /opt/apps/globalnet

cd /opt/apps/globalnet
```

### 5️⃣ Install Application Code

**Option A: Clone from Git**
```bash
git clone <your-repo-url> .
```

**Option B: From Local Machine (Run from your laptop)**
```bash
# From your local machine, in the GlobalNet directory:
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.git' \
  ./ root@168.231.84.168:/opt/apps/globalnet/
```

### 6️⃣ Install Dependencies
```bash
cd /opt/apps/globalnet
npm install
```

### 7️⃣ SSL Certificate Setup
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Stop Nginx (if running)
sudo systemctl stop nginx 2>/dev/null || true

# Request SSL certificate (wait for DNS propagation first!)
sudo certbot certonly --standalone \
  -d globalnet \
  --non-interactive \
  --agree-tos \
  --email admin@globalnet \
  --rsa-key-size 4096

# Verify certificate
sudo ls /etc/letsencrypt/live/globalnet/
```

### 8️⃣ Configure Nginx
```bash
# Install Nginx
sudo apt install -y nginx

# Create config file
sudo tee /etc/nginx/sites-available/globalnet > /dev/null << 'NGINX_CONFIG'
# HTTP to HTTPS redirect
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

    ssl_certificate /etc/letsencrypt/live/globalnet/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/globalnet/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    gzip on;
    gzip_types text/plain text/css text/javascript application/json application/xml;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
    }
}
NGINX_CONFIG

# Enable site
sudo ln -sf /etc/nginx/sites-available/globalnet /etc/nginx/sites-enabled/globalnet
sudo rm -f /etc/nginx/sites-enabled/default

# Test and start
sudo nginx -t
sudo systemctl enable nginx && sudo systemctl start nginx
```

### 9️⃣ Environment Configuration
```bash
cd /opt/apps/globalnet

# Create .env file
cp .env.production .env

# Generate NEXTAUTH_SECRET
SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo "Generated NEXTAUTH_SECRET: $SECRET"

# Edit .env with your values
nano .env
```

**In the editor (nano), update these values:**
```env
DATABASE_URL="postgresql://globalnet_user:YOUR_DB_PASSWORD@localhost:5432/cleaning_app"
NEXTAUTH_SECRET="YOUR_GENERATED_SECRET_HERE"
NEXTAUTH_URL="https://globalnet"
```

Press `CTRL+X`, then `Y`, then `ENTER` to save.

### 🔟 Build & Migrate
```bash
cd /opt/apps/globalnet

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Build application
npm run build

# Verify build succeeded
ls -la .next/
```

### 1️⃣1️⃣ Create Systemd Service
```bash
sudo tee /etc/systemd/system/globalnet.service > /dev/null << 'SERVICE_CONFIG'
[Unit]
Description=GlobalNet Next.js Application
After=network.target postgresql.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/apps/globalnet
EnvironmentFile=/opt/apps/globalnet/.env
Environment="NODE_ENV=production"
ExecStart=/usr/bin/node /opt/apps/globalnet/node_modules/.bin/next start -p 3000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
SERVICE_CONFIG

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable globalnet
sudo systemctl start globalnet
```

### 1️⃣2️⃣ Verify Everything Works
```bash
# Check service status
sudo systemctl status globalnet

# View logs
sudo journalctl -u globalnet -f

# Test connection (wait 10-20 seconds for startup)
curl https://localhost/ 2>/dev/null | head -20

# Check SSL
curl -I https://globalnet
```

---

## 🔑 DNS Configuration

**Add this DNS record at your registrar:**

```
Type:  A
Name:  globalnet
Value: 168.231.84.168
TTL:   300
```

⏳ **Wait 10-15 minutes for DNS propagation before accessing the site**

---

## 📊 Monitoring & Logs

```bash
# Real-time logs
sudo journalctl -u globalnet -f

# Last 50 log entries
sudo journalctl -u globalnet -n 50

# Database test
psql -U globalnet_user -d cleaning_app -h localhost -c "SELECT COUNT(*) FROM \"User\";"

# Check running processes
ps aux | grep node | grep -v grep
```

---

## 🆘 Troubleshooting

### Application won't start
```bash
# Check logs
sudo journalctl -u globalnet -n 50

# Check database
psql -U globalnet_user -d cleaning_app -h localhost -c "\dt"

# Check port
netstat -tlnp | grep 3000
```

### Nginx issues
```bash
# Check syntax
sudo nginx -t

# Check logs
sudo tail -f /var/log/nginx/error.log
```

### SSL certificate issues
```bash
# Check status
sudo certbot certificates

# Renew manually
sudo certbot renew
```

---

## ✅ Success Checklist

- [ ] DNS record added and propagated (ping globalnet)
- [ ] SSH connection works
- [ ] Node.js installed (node -v shows v18.x.x)
- [ ] PostgreSQL running (sudo systemctl status postgresql)
- [ ] Database created (SELECT 1 works)
- [ ] Application code copied
- [ ] Dependencies installed (npm list @prisma/client shows version)
- [ ] SSL certificate obtained
- [ ] Nginx configured and running
- [ ] .env file configured with correct values
- [ ] Database migrations run
- [ ] Application builds successfully
- [ ] Systemd service created and running
- [ ] Application accessible at https://globalnet
- [ ] SSL certificate valid (https works)

---

## 📞 Quick Reference

| Item | Location | Command |
|------|----------|---------|
| Application | `/opt/apps/globalnet` | `cd /opt/apps/globalnet` |
| Logs | systemd journal | `journalctl -u globalnet -f` |
| Database | PostgreSQL localhost | `psql -U globalnet_user -d cleaning_app` |
| Config | `.env` file | `nano /opt/apps/globalnet/.env` |
| Nginx | `/etc/nginx/sites-available/globalnet` | `sudo nano /etc/nginx/sites-available/globalnet` |
| SSL Certs | `/etc/letsencrypt/live/globalnet/` | `sudo certbot certificates` |
| Service | systemd | `sudo systemctl status globalnet` |

---

**Total Installation Time**: ~15-20 minutes (depending on system speed and DNS propagation)

**Questions?** Check `VPS_INSTALLATION_GUIDE.md` for detailed explanations.

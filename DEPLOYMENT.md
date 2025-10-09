# 🚀 Deployment Guide

Complete guide for deploying the AI Attendance System to production.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Database Deployment](#database-deployment)
- [Backend Deployment](#backend-deployment)
- [Frontend Deployment](#frontend-deployment)
- [AI Service Deployment](#ai-service-deployment)
- [Domain & SSL Setup](#domain--ssl-setup)
- [Monitoring & Maintenance](#monitoring--maintenance)

---

## 🔧 Prerequisites

Before deploying, ensure you have:

- [ ] Production-ready code (tested locally)
- [ ] Domain name (optional but recommended)
- [ ] Cloud hosting account (Heroku, AWS, DigitalOcean, etc.)
- [ ] MongoDB Atlas account (or self-hosted MongoDB)
- [ ] Cloudinary account
- [ ] Git repository (GitHub, GitLab, Bitbucket)

---

## 🌍 Environment Setup

### 1. Production Environment Variables

Create production `.env` files with secure values:

**Backend (.env)**
```env
# Server
PORT=5000
NODE_ENV=production

# Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-attendance?retryWrites=true&w=majority

# JWT (Use strong secret)
JWT_SECRET=your_production_jwt_secret_min_32_characters_long
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_production_cloud_name
CLOUDINARY_API_KEY=your_production_api_key
CLOUDINARY_API_SECRET=your_production_api_secret

# AI Service
AI_SERVICE_URL=https://your-ai-service.com/api/recognize
AI_SERVICE_ENABLED=true

# CORS
CORS_ORIGIN=https://your-frontend-domain.com

# Admin
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=SecurePassword123!
ADMIN_NAME=System Administrator
```

**Frontend (.env.production)**
```env
VITE_API_URL=https://your-backend-api.com/api
```

### 2. Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secret (min 32 characters)
- [ ] Enable HTTPS/SSL
- [ ] Set secure CORS origins
- [ ] Remove console.logs from production code
- [ ] Enable rate limiting
- [ ] Set up firewall rules
- [ ] Use environment variables (never hardcode secrets)

---

## 🗄️ Database Deployment

### Option 1: MongoDB Atlas (Recommended)

1. **Create Account**
   - Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free tier or paid plan

2. **Create Cluster**
   ```
   - Choose cloud provider (AWS, GCP, Azure)
   - Select region (closest to your users)
   - Choose cluster tier (M0 free, M10+ for production)
   - Click "Create Cluster"
   ```

3. **Configure Security**
   ```
   - Database Access → Add Database User
   - Network Access → Add IP Address (0.0.0.0/0 for all, or specific IPs)
   - Create username and strong password
   ```

4. **Get Connection String**
   ```
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string
   - Replace <password> with your password
   - Update MONGODB_URI in backend .env
   ```

5. **Create Database**
   ```
   - Collections → Create Database
   - Database name: ai-attendance
   - Collection name: users
   ```

### Option 2: Self-Hosted MongoDB

1. **Install on Server**
   ```bash
   # Ubuntu/Debian
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```

2. **Configure MongoDB**
   ```bash
   sudo nano /etc/mongod.conf
   
   # Enable authentication
   security:
     authorization: enabled
   
   # Bind to all interfaces
   net:
     bindIp: 0.0.0.0
   ```

3. **Create Admin User**
   ```bash
   mongosh
   use admin
   db.createUser({
     user: "admin",
     pwd: "SecurePassword123!",
     roles: ["root"]
   })
   ```

4. **Start MongoDB**
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

---

## 🔙 Backend Deployment

### Option 1: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   cd backend
   heroku create your-app-name-api
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI="your_mongodb_uri"
   heroku config:set JWT_SECRET="your_jwt_secret"
   heroku config:set CLOUDINARY_CLOUD_NAME="your_cloud_name"
   heroku config:set CLOUDINARY_API_KEY="your_api_key"
   heroku config:set CLOUDINARY_API_SECRET="your_api_secret"
   heroku config:set CORS_ORIGIN="https://your-frontend.com"
   ```

4. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

5. **Open App**
   ```bash
   heroku open
   heroku logs --tail
   ```

### Option 2: DigitalOcean (VPS)

1. **Create Droplet**
   - Choose Ubuntu 22.04 LTS
   - Select plan (minimum $6/month)
   - Add SSH key
   - Create droplet

2. **Connect to Server**
   ```bash
   ssh root@your_server_ip
   ```

3. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   node --version
   ```

4. **Install PM2**
   ```bash
   npm install -g pm2
   ```

5. **Clone Repository**
   ```bash
   cd /var/www
   git clone https://github.com/yourusername/ai-attendance.git
   cd ai-attendance/backend
   npm install --production
   ```

6. **Create .env File**
   ```bash
   nano .env
   # Paste production environment variables
   ```

7. **Start with PM2**
   ```bash
   pm2 start src/server.js --name ai-attendance-api
   pm2 save
   pm2 startup
   ```

8. **Configure Nginx**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/api.yourdomain.com
   ```

   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/api.yourdomain.com /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Option 3: AWS EC2

1. **Launch EC2 Instance**
   - Choose Amazon Linux 2 or Ubuntu
   - Select t2.micro (free tier) or larger
   - Configure security group (ports 22, 80, 443, 5000)
   - Launch instance

2. **Connect to Instance**
   ```bash
   ssh -i your-key.pem ec2-user@your-instance-ip
   ```

3. **Install Dependencies**
   ```bash
   # Update system
   sudo yum update -y  # Amazon Linux
   # or
   sudo apt update && sudo apt upgrade -y  # Ubuntu

   # Install Node.js
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   source ~/.bashrc
   nvm install 18
   ```

4. **Deploy Application** (Same as DigitalOcean steps 5-8)

---

## 🎨 Frontend Deployment

### Option 1: Vercel (Recommended for React)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel login
   vercel
   ```

3. **Configure Environment Variables**
   - Go to Vercel Dashboard
   - Select your project
   - Settings → Environment Variables
   - Add: `VITE_API_URL=https://your-backend-api.com/api`

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Option 2: Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build Project**
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy**
   ```bash
   netlify login
   netlify deploy --prod --dir=dist
   ```

4. **Configure Environment**
   - Go to Netlify Dashboard
   - Site settings → Environment variables
   - Add: `VITE_API_URL`

### Option 3: AWS S3 + CloudFront

1. **Build Project**
   ```bash
   cd frontend
   npm run build
   ```

2. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://your-app-name
   aws s3 website s3://your-app-name --index-document index.html
   ```

3. **Upload Files**
   ```bash
   aws s3 sync dist/ s3://your-app-name --acl public-read
   ```

4. **Create CloudFront Distribution**
   - Go to AWS CloudFront
   - Create distribution
   - Origin: Your S3 bucket
   - Enable HTTPS
   - Deploy

### Option 4: Same Server as Backend (Nginx)

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Copy to Server**
   ```bash
   scp -r dist/* root@your_server_ip:/var/www/html/
   ```

3. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/yourdomain.com
   ```

   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       root /var/www/html;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

## 🤖 AI Service Deployment

### Option 1: Heroku (Python)

1. **Create Procfile**
   ```
   web: python app.py
   ```

2. **Create runtime.txt**
   ```
   python-3.9.16
   ```

3. **Deploy**
   ```bash
   cd ai-service
   heroku create your-app-name-ai
   git push heroku main
   ```

### Option 2: DigitalOcean/AWS

1. **Install Python**
   ```bash
   sudo apt install python3 python3-pip python3-venv
   ```

2. **Setup Virtual Environment**
   ```bash
   cd /var/www/ai-service
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Create Systemd Service**
   ```bash
   sudo nano /etc/systemd/system/ai-service.service
   ```

   ```ini
   [Unit]
   Description=AI Face Recognition Service
   After=network.target

   [Service]
   User=www-data
   WorkingDirectory=/var/www/ai-service
   ExecStart=/var/www/ai-service/venv/bin/python app.py
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

   ```bash
   sudo systemctl start ai-service
   sudo systemctl enable ai-service
   ```

4. **Configure Nginx**
   ```nginx
   location /ai {
       proxy_pass http://localhost:8000;
   }
   ```

---

## 🔒 Domain & SSL Setup

### 1. Configure Domain

**DNS Records:**
```
Type    Name    Value
A       @       your_server_ip
A       www     your_server_ip
CNAME   api     your_server_ip
```

### 2. Install SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get Certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### 3. Update CORS and Environment

```env
# Backend .env
CORS_ORIGIN=https://yourdomain.com

# Frontend .env
VITE_API_URL=https://api.yourdomain.com/api
```

---

## 📊 Monitoring & Maintenance

### 1. Application Monitoring

**PM2 Monitoring:**
```bash
pm2 monit
pm2 logs
pm2 status
```

**Setup PM2 Web Dashboard:**
```bash
pm2 install pm2-server-monit
```

### 2. Error Tracking (Sentry)

1. **Install Sentry**
   ```bash
   npm install @sentry/node
   ```

2. **Configure Backend**
   ```javascript
   import * as Sentry from "@sentry/node";
   
   Sentry.init({
     dsn: "your_sentry_dsn",
     environment: process.env.NODE_ENV,
   });
   ```

### 3. Database Backups

**Automated Backup Script:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="your_mongodb_uri" --out=/backups/backup_$DATE
find /backups -mtime +7 -delete
```

**Cron Job:**
```bash
crontab -e
0 2 * * * /path/to/backup.sh
```

### 4. Server Monitoring

**Install Monitoring Tools:**
```bash
# htop for process monitoring
sudo apt install htop

# netdata for real-time monitoring
bash <(curl -Ss https://my-netdata.io/kickstart.sh)
```

### 5. Log Management

**Configure Log Rotation:**
```bash
sudo nano /etc/logrotate.d/ai-attendance
```

```
/var/log/ai-attendance/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
}
```

---

## 🔄 CI/CD Setup (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "your-app-name-api"
          heroku_email: "your-email@example.com"
          appdir: "backend"

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID}}
          vercel-project-id: ${{ secrets.PROJECT_ID}}
          working-directory: ./frontend
```

---

## ✅ Post-Deployment Checklist

- [ ] All services running (Backend, Frontend, Database, AI)
- [ ] SSL certificate installed and working
- [ ] Environment variables configured
- [ ] CORS properly set
- [ ] Database connected
- [ ] File uploads working (Cloudinary)
- [ ] Face recognition functional
- [ ] Email notifications working (if configured)
- [ ] Backups automated
- [ ] Monitoring tools active
- [ ] Error tracking enabled
- [ ] Performance optimized
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Documentation updated

---

## 🆘 Troubleshooting

### Common Issues

1. **CORS Error**
   - Check CORS_ORIGIN in backend .env
   - Verify frontend URL matches

2. **Database Connection Failed**
   - Check MongoDB URI
   - Verify network access in MongoDB Atlas
   - Check firewall rules

3. **502 Bad Gateway**
   - Check if backend is running
   - Verify Nginx configuration
   - Check PM2 logs

4. **SSL Certificate Issues**
   - Renew certificate: `sudo certbot renew`
   - Check DNS records
   - Verify domain ownership

---

## 📞 Support

For deployment issues:
- Email: devops@attendance.com
- Slack: #deployment-help
- Documentation: https://docs.attendance.com

---

**🎉 Congratulations! Your AI Attendance System is now live in production!**

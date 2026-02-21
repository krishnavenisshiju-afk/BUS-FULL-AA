# Deployment Guide - BUS-FULL-AA

Complete guide for deploying the BUS-FULL-AA application to production.

## Table of Contents
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Local Testing](#local-testing)
- [Deployment Platforms](#deployment-platforms)
- [Environment Configuration](#environment-configuration)
- [Security Setup](#security-setup)
- [Monitoring & Maintenance](#monitoring--maintenance)

---

## Pre-Deployment Checklist

Before deploying to production, ensure:

### Code Quality
- [ ] All code comments are clear and comprehensive
- [ ] No hardcoded credentials or sensitive data
- [ ] Code follows consistent naming conventions
- [ ] Files are properly organized in folders
- [ ] No console.log() statements remain in production code (or use logging library)
- [ ] Error handling is implemented
- [ ] Input validation is in place

### Testing
- [ ] All endpoints tested locally
- [ ] Frontend loads without errors
- [ ] QR scanning works on target devices
- [ ] Bus search functionality verified
- [ ] Network connectivity tested

### Documentation
- [ ] README.md is complete and accurate
- [ ] API documentation is up-to-date
- [ ] Architecture diagram included
- [ ] Installation and run commands documented
- [ ] Team members listed
- [ ] License file included

### Security
- [ ] HTTPS/TLS enabled
- [ ] CORS configured properly
- [ ] Input validation implemented
- [ ] No sensitive data in version control
- [ ] .gitignore configured

---

## Local Testing

### Development Environment Setup

```bash
# Clone repository
git clone https://github.com/krishnavenisshiju-afk/BUS-FULL-AA.git
cd BUS-FULL-AA-1

# Install dependencies
cd backend
npm install
cd ..

# Start backend
cd backend
node server.js

# In another terminal, access frontend
# Open http://localhost:5000 in browser
```

### Testing Checklist

1. **Backend Server**
   ```bash
   # Check if running
   curl http://localhost:5000
   # Should return: "Backend is working 🚀"
   ```

2. **Bus Search**
   - Enter starting point and destination
   - Verify buses are returned
   - Check passenger counts display

3. **QR Scanning**
   - Open scanner page
   - Allow camera access
   - Scan test QR codes
   - Verify check-in/out works

4. **Network Testing**
   - Get your machine's IP: `ipconfig` (Windows) or `ifconfig` (Linux/Mac)
   - Access from another device: `http://YOUR_IP:5000`
   - Verify functionality works over network

---

## Deployment Platforms

### Option 1: Heroku (Recommended for Beginners)

#### Step 1: Create Heroku Account
- Go to [heroku.com](https://www.heroku.com)
- Sign up for free account
- Install Heroku CLI

#### Step 2: Prepare for Deployment
```bash
cd BUS-FULL-AA-1

# Login to Heroku
heroku login

# Create Heroku app
heroku create bus-full-aa

# Add Procfile
echo "web: cd backend && node server.js" > Procfile
```

#### Step 3: Deploy
```bash
# Push to Heroku
git push heroku main

# View logs
heroku logs --tail

# Open live app
heroku open
```

#### Step 4: Update Frontend URLs
Replace all:
```javascript
http://localhost:5000
```
With:
```javascript
https://bus-full-aa.herokuapp.com
```

---

### Option 2: AWS EC2

#### Step 1: Launch EC2 Instance
- Instance Type: `t3.micro` (free tier)
- OS: Ubuntu 20.04 LTS
- Security Group: Allow ports 80, 443, 5000
- Create key pair and save (.pem file)

#### Step 2: Connect to Instance
```bash
# SSH into instance
ssh -i "your-key.pem" ubuntu@YOUR_EC2_PUBLIC_IP

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install git
sudo apt install -y git
```

#### Step 3: Deploy Application
```bash
# Clone repository
git clone https://github.com/krishnavenisshiju-afk/BUS-FULL-AA.git
cd BUS-FULL-AA-1/backend

# Install dependencies
npm install

# Start server with PM2 (persistent)
sudo npm install -g pm2
pm2 start server.js --name "bus-api"
pm2 save
pm2 startup
```

#### Step 4: Setup Nginx Reverse Proxy
```bash
# Install Nginx
sudo apt install -y nginx

# Create config
sudo nano /etc/nginx/sites-available/bus-full-aa
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

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
# Enable site
sudo ln -s /etc/nginx/sites-available/bus-full-aa /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 5: Setup HTTPS (Let's Encrypt)
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d YOUR_DOMAIN

# Auto-renewal
sudo systemctl enable certbot.timer
```

---

### Option 3: Google Cloud Platform (GCP)

#### Step 1: Create Cloud Run Service
```bash
# Install Google Cloud SDK
# https://cloud.google.com/sdk/docs/install

# Login
gcloud auth login

# Create project
gcloud projects create bus-full-aa

# Set project
gcloud config set project bus-full-aa

# Deploy
gcloud run deploy bus-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --port 5000
```

#### Step 2: Update Frontend
Use the Cloud Run URL provided for backend communications.

---

## Environment Configuration

### Create .env File (if extending to use environment variables)

```bash
# .env file (DO NOT commit to git)
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://yourdomain.com
```

### Update server.js
```javascript
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
```

### Add to package.json
```json
{
  "dependencies": {
    "dotenv": "^16.0.0"
  }
}
```

---

## Security Setup

### 1. HTTPS/TLS Configuration

**For Production:**
- Always use HTTPS
- Install SSL certificate (Let's Encrypt FREE)
- Enforce HTTPS redirects
- Enable HSTS header

**Nginx Configuration:**
```nginx
server {
    listen 443 ssl http2;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### 2. CORS Configuration

**Current (Development):**
```javascript
app.use(cors());  // Allow all origins
```

**Production:**
```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST'],
  credentials: true
}));
```

### 3. Input Validation

Already implemented in API endpoints. Ensure:
- Empty parameters are rejected
- Invalid data types are handled
- SQL injection prevented (if using database)

### 4. Rate Limiting

```javascript
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100  // 100 requests per windowMs
});

app.use("/api/", limiter);
```

### 5. Security Headers

```javascript
const helmet = require("helmet");
app.use(helmet());  // Adds various HTTP headers
```

---

## Monitoring & Maintenance

### 1. Application Monitoring

**Using PM2:**
```bash
# Monitor running processes
pm2 monit

# View logs
pm2 logs bus-api

# Setup log rotation
pm2 install pm2-logrotate
```

**Using Uptime Robot:**
- Service: https://uptimerobot.com
- Monitor endpoint: `https://yourdomain.com/`
- Alerts via email/SMS if down

### 2. Error Tracking

**Sentry (Free Tier Available):**
```bash
npm install @sentry/node
```

```javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

### 3. Performance Monitoring

**CloudFlare (Free):**
- Free DDoS protection
- Performance optimization
- Caching layer
- Analytics

**Steps:**
1. Create CloudFlare account
2. Add your domain
3. Update nameservers
4. Enable caching rules

### 4. Regular Maintenance

- [ ] Check for dependency updates: `npm outdated`
- [ ] Review security vulnerabilities: `npm audit`
- [ ] Monitor server logs daily
- [ ] Backup data regularly
- [ ] Update SSL certificates before expiration
- [ ] Test disaster recovery procedures

### 5. Automated Backups

For production data (if database added):
```bash
# Add to crontab (runs daily at 2 AM)
0 2 * * * /path/to/backup-script.sh
```

---

## Testing After Deployment

### Critical Tests

1. **Health Check**
   ```bash
   curl https://yourdomain.com/
   ```

2. **Bus Search**
   ```bash
   curl "https://yourdomain.com/buses?from=ALUVA&to=VYTILA"
   ```

3. **QR Scanning**
   - Open app on mobile
   - Test camera access
   - Verify scan functionality

4. **Performance**
   - Load testing with Apache Bench
   - Mobile performance test with PageSpeed
   - Network latency checks

### SSL/TLS Verification

```bash
# Test SSL certificate
ssl-test https://yourdomain.com

# Or use online tool
# https://www.ssllabs.com/ssltest/
```

---

## Scaling Considerations

For future growth:

1. **Database:** Replace in-memory storage with MongoDB/PostgreSQL
2. **Caching:** Add Redis for session management
3. **CDN:** Use CloudFlare/AWS CloudFront for static files
4. **Load Balancing:** Deploy multiple instances behind load balancer
5. **Microservices:** Split into separate services if needed

---

## Rollback Procedures

### Git-Based Rollback
```bash
# View commit history
git log --oneline

# Rollback to previous version
git revert COMMIT_HASH
git push

# Or hard reset (caution!)
git reset --hard PREVIOUS_COMMIT
git push -f
```

### Heroku Rollback
```bash
heroku releases
heroku rollback v42  # Rollback to version 42
```

---

**Last Updated:** February 2026

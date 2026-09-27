# Bus Tracking Backend - Deployment Guide

## Deployment Options

---

## Option 1: Deploy to Heroku (Recommended for Beginners)

### Prerequisites
- Heroku account (free at https://heroku.com)
- Heroku CLI installed
- Git repository initialized

### Steps

#### 1. Install Heroku CLI
```bash
# Windows
choco install heroku-cli

# Mac
brew tap heroku/brew && brew install heroku

# Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

#### 2. Login to Heroku
```bash
heroku login
# Opens browser for authentication
```

#### 3. Create Procfile
```bash
# In backend folder root
echo "web: node server.js" > Procfile
```

#### 4. Create Heroku App
```bash
heroku create your-app-name
```

#### 5. Add PostgreSQL Database
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

#### 6. Set Environment Variables
```bash
heroku config:set JWT_SECRET=your_production_secret_key
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://your-frontend-url.vercel.app
```

#### 7. Deploy
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

#### 8. Create Database Schema
```bash
heroku run "psql < db/schema.sql"
```

### Verify Deployment
```bash
# Check logs
heroku logs --tail

# Test health endpoint
curl https://your-app-name.herokuapp.com/api/health
```

---

## Option 2: Deploy to Railway

### Prerequisites
- Railway account (free at https://railway.app)
- GitHub repository

### Steps

#### 1. Connect GitHub Repository
- Go to https://railway.app
- Click "New Project"
- Select "Deploy from GitHub"
- Authorize and select your repository

#### 2. Add PostgreSQL Plugin
- Click "Add Plugin"
- Select "PostgreSQL"
- Railway auto-configures environment variables

#### 3. Configure Node Environment
- Environment variables auto-populated from PostgreSQL
- Add custom vars if needed:
  - JWT_SECRET
  - FRONTEND_URL

#### 4. Deploy
- Automatic on every GitHub push to main branch
- Or click "Deploy" button manually

---

## Option 3: Deploy to DigitalOcean

### Prerequisites
- DigitalOcean account
- SSH key setup
- Domain name (optional)

### Steps

#### 1. Create Droplet
- Size: $5/month (1GB RAM)
- Region: Choose closest to users
- Image: Ubuntu 20.04 LTS

#### 2. SSH into Droplet
```bash
ssh root@your_droplet_ip
```

#### 3. Install Node.js & PostgreSQL
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
apt install -y nodejs

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Install git
apt install -y git
```

#### 4. Setup PostgreSQL
```bash
sudo -u postgres psql
CREATE DATABASE bus_tracking;
\q
```

#### 5. Clone Repository
```bash
cd /var/www
git clone your-repo-url bus-tracking-backend
cd bus-tracking-backend
```

#### 6. Install Dependencies & Setup
```bash
npm install
cp .env.example .env
nano .env  # Edit environment variables
```

#### 7. Run Database Schema
```bash
psql -U postgres -d bus_tracking -f db/schema.sql
```

#### 8. Setup PM2 (Process Manager)
```bash
npm install -g pm2
pm2 start server.js --name "bus-tracking"
pm2 startup
pm2 save
```

#### 9. Setup Nginx Reverse Proxy
```bash
apt install -y nginx

# Create nginx config
nano /etc/nginx/sites-available/bus-tracking
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

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

Enable site:
```bash
ln -s /etc/nginx/sites-available/bus-tracking /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### 10. Setup SSL (HTTPS)
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

---

## Option 4: Deploy to AWS

### Prerequisites
- AWS account
- EC2 knowledge
- AWS CLI

### Quick Setup
```bash
# Create EC2 instance (t2.micro free tier)
# Choose Ubuntu 20.04
# SSH into instance

# Follow DigitalOcean steps above (same process)
```

---

## Post-Deployment

### 1. Update Frontend .env
```
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

### 2. Monitor Application
```bash
# Heroku
heroku logs --tail

# Railway
# View logs in dashboard

# DigitalOcean
pm2 logs
```

### 3. Setup Backups
```bash
# PostgreSQL backup
pg_dump bus_tracking > backup.sql

# Schedule automated backups
# Most hosting platforms offer automatic backups
```

### 4. Enable CORS for Production
Update server.js:
```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true
}))
```

---

## Monitoring & Logging

### Setup Error Monitoring (Optional)
```bash
npm install sentry
```

In server.js:
```javascript
const Sentry = require('@sentry/node')

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN'
})

app.use(Sentry.Handlers.errorHandler())
```

---

## Scaling Considerations

### As Traffic Grows
1. **Database**: Upgrade PostgreSQL instance
2. **Server**: Add more instances with load balancer
3. **Cache**: Add Redis for caching
4. **CDN**: Use Cloudflare for static assets

### Database Optimization
```sql
-- Add indexes
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_booking_user ON bookings(passenger_id);
CREATE INDEX idx_gps_bus ON gps_tracking(bus_id);
```

---

## Troubleshooting Deployment

### Issue: Application crashes on startup
```bash
# Check logs
heroku logs --tail  # or pm2 logs

# Common causes:
# 1. Missing environment variables
# 2. Database connection failed
# 3. Module dependencies not installed
```

### Issue: Database connection timeout
```bash
# Check PostgreSQL is running
sudo service postgresql status

# Restart if needed
sudo service postgresql restart
```

### Issue: High memory usage
```bash
# Monitor memory
free -h

# Restart application
pm2 restart bus-tracking
```

---

## Comparison

| Platform | Cost | Setup Difficulty | Auto-scaling |
|----------|------|------------------|--------------|
| Heroku | $7+/month | Easy | Yes |
| Railway | $5+/month | Very Easy | Yes |
| DigitalOcean | $5+/month | Medium | No (manual) |
| AWS | Variable | Hard | Yes |

---

## Recommended: Start with Railway

1. Connect GitHub
2. Add PostgreSQL plugin
3. One-click deploy
4. Auto-deploys on code push

Perfect for development and small projects!

---

For questions, refer to provider documentation:
- Heroku: https://devcenter.heroku.com
- Railway: https://docs.railway.app
- DigitalOcean: https://docs.digitalocean.com

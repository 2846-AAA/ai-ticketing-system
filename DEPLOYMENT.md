# 🚀 Deployment Guide

## Prerequisites for Deployment

- Git installed
- GitHub account
- PostgreSQL database (can use free tier from ElephantSQL or Railway)
- Heroku/Railway account for backend
- Vercel/Netlify account for frontend

---

## 📦 GitHub Deployment

### 1. Create GitHub Repository

```bash
# Initialize git repository
cd ai-ticketing-system
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: AI Ticketing System"

# Add remote repository
git remote add origin https://github.com/yourusername/ai-ticketing-system.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 2. Repository Settings

1. Go to your repository on GitHub
2. Add a description: "AI-Integrated RESTful Ticketing System with NLP"
3. Add topics: `django`, `react`, `nlp`, `ticketing-system`, `restful-api`, `ai`
4. Update README.md with your GitHub username

---

## 🔧 Backend Deployment (Railway/Heroku)

### Option 1: Railway (Recommended)

#### Step 1: Create Railway Project

1. Go to [Railway.app](https://railway.app)
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account
5. Select `ai-ticketing-system` repository

#### Step 2: Add PostgreSQL Database

1. In your Railway project, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically provision a database
4. Note the connection details

#### Step 3: Configure Backend Service

1. Click "+ New" → "GitHub Repo"
2. Select your repository
3. Set root directory: `/backend`
4. Add environment variables:

```env
SECRET_KEY=your-production-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-app.railway.app

DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}

CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
```

#### Step 4: Add Build Commands

**Build Command:**
```bash
pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
```

**Start Command:**
```bash
gunicorn ticketing_system.wsgi
```

#### Step 5: Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Your backend will be available at: `https://your-app.railway.app`

### Option 2: Heroku

#### Step 1: Install Heroku CLI

```bash
# Install Heroku CLI
# Visit: https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login
```

#### Step 2: Create Heroku App

```bash
cd backend
heroku create your-app-name
```

#### Step 3: Add PostgreSQL

```bash
heroku addons:create heroku-postgresql:mini
```

#### Step 4: Set Environment Variables

```bash
heroku config:set SECRET_KEY=your-production-secret-key
heroku config:set DEBUG=False
heroku config:set ALLOWED_HOSTS=your-app-name.herokuapp.com
heroku config:set CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
```

#### Step 5: Create Procfile

Create `backend/Procfile`:
```
web: gunicorn ticketing_system.wsgi
release: python manage.py migrate
```

#### Step 6: Deploy

```bash
git add .
git commit -m "Configure for Heroku deployment"
git push heroku main
```

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

Update `frontend/package.json` to include homepage:

```json
{
  "homepage": ".",
  ...
}
```

### Step 2: Deploy to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

### Step 3: Set Environment Variables

Add in Vercel dashboard:
```
REACT_APP_API_URL=https://your-backend.railway.app/api
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for deployment
3. Your frontend will be available at: `https://your-app.vercel.app`

---

## 🔐 Post-Deployment Steps

### 1. Create Superuser

```bash
# For Railway
railway run python manage.py createsuperuser

# For Heroku
heroku run python manage.py createsuperuser
```

### 2. Update CORS Settings

Update backend environment variables to include your frontend domain:

```env
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
```

### 3. Test the Application

1. Visit your frontend URL
2. Create a test ticket
3. Verify AI prioritization works
4. Check admin panel at `/admin`

---

## 📊 Monitoring & Maintenance

### Backend Monitoring

**Railway:**
- View logs in Railway dashboard
- Monitor database metrics
- Set up alerts

**Heroku:**
```bash
heroku logs --tail
heroku ps
```

### Database Backup

**Railway:**
- Automatic backups included

**Heroku:**
```bash
heroku pg:backups:capture
heroku pg:backups:download
```

---

## 🔄 Continuous Deployment

GitHub Actions is already configured. Every push to `main` will:
1. Run tests
2. Build frontend
3. Auto-deploy if tests pass

---

## 🐛 Troubleshooting

### Issue: Database Connection Error

**Solution:**
- Check database credentials in environment variables
- Ensure database is running
- Verify network connectivity

### Issue: CORS Error

**Solution:**
- Update `CORS_ALLOWED_ORIGINS` with frontend URL
- Ensure no trailing slashes
- Include protocol (https://)

### Issue: Static Files Not Loading

**Solution:**
```bash
python manage.py collectstatic --noinput
```

### Issue: NLP Not Working

**Solution:**
```bash
# Download NLTK data on server
python -c "import nltk; nltk.download('punkt'); nltk.download('brown')"
```

---

## 📈 Scaling Considerations

### Database
- Upgrade to paid tier for production
- Enable connection pooling
- Add read replicas for high traffic

### Backend
- Increase dyno/instance size
- Enable auto-scaling
- Add Redis for caching

### Frontend
- Use Vercel's CDN (automatic)
- Enable edge caching
- Optimize bundle size

---

## 🔒 Security Checklist

- [ ] Change SECRET_KEY in production
- [ ] Set DEBUG=False
- [ ] Use HTTPS only
- [ ] Enable CSRF protection
- [ ] Implement rate limiting
- [ ] Regular security updates
- [ ] Database backups enabled
- [ ] Environment variables secured

---

## 💰 Cost Estimation

**Free Tier:**
- Railway: Free tier available (500 hours/month)
- Vercel: Free for personal projects
- PostgreSQL: Free tier on Railway/ElephantSQL

**Paid Tier (Small App):**
- Railway: ~$5-10/month
- Vercel Pro: $20/month (optional)
- Database: $10-20/month

---

## 📞 Support

For deployment issues:
1. Check application logs
2. Review environment variables
3. Verify database connectivity
4. Consult platform documentation

---

**🎉 Congratulations! Your AI Ticketing System is now deployed!**

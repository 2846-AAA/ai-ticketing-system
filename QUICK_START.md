# ⚡ Quick Start Guide

Get your AI Ticketing System running in **5 minutes**!

## 🎯 Prerequisites

- Python 3.8+ installed
- Node.js 16+ installed
- PostgreSQL 12+ running
- Git installed

---

## 🚀 Quick Setup

### 1. Clone & Setup (2 minutes)

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-ticketing-system.git
cd ai-ticketing-system

# Make setup script executable (macOS/Linux)
chmod +x setup.sh

# Run automated setup
./setup.sh
```

**For Windows:** Run commands manually or use Git Bash

### 2. Configure Database (1 minute)

Create PostgreSQL database:

```sql
CREATE DATABASE ticketing_db;
```

Update `backend/.env`:
```env
DB_NAME=ticketing_db
DB_USER=postgres
DB_PASSWORD=your_password
```

### 3. Initialize Backend (1 minute)

```bash
cd backend

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
# OR
venv\Scripts\activate     # Windows

# Run migrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser
```

### 4. Start Application (1 minute)

**Terminal 1 - Backend:**
```bash
cd backend
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

---

## 🎉 You're Done!

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/api
- **Admin Panel:** http://localhost:8000/admin

---

## 📝 Test the AI Features

### Create Your First Ticket

1. Go to http://localhost:3000
2. Click "+ New Ticket"
3. Try this:

```
Title: URGENT: Production database crashed!

Description: The production database is completely down. 
Users cannot access the application and we're losing money. 
This is a critical emergency that needs immediate attention ASAP!
```

4. Watch the AI automatically assign "Critical" priority! 🤖

---

## 🔧 Quick Commands

```bash
# Backend commands
python manage.py migrate         # Run migrations
python manage.py createsuperuser # Create admin
python manage.py runserver       # Start server

# Frontend commands
npm install                      # Install dependencies
npm start                        # Development server
npm run build                   # Production build
```

---

## 📚 Next Steps

1. **Explore Features:**
   - Create tickets with different urgency levels
   - Use the auto-route feature
   - Check AI sentiment analysis
   - View dashboard statistics

2. **Test API with Postman:**
   - Import `postman_collection.json`
   - Test all endpoints

3. **Customize:**
   - Modify NLP keywords in `backend/tickets/nlp_service.py`
   - Customize UI in frontend components
   - Add more ticket categories

4. **Deploy:**
   - Follow `DEPLOYMENT.md` for production deployment
   - Deploy to Railway/Heroku + Vercel

---

## ❓ Troubleshooting

**Port already in use?**
```bash
# Change backend port
python manage.py runserver 8001

# Change frontend port
PORT=3001 npm start
```

**Database connection error?**
- Check PostgreSQL is running
- Verify credentials in `.env`
- Ensure database exists

**NLP not working?**
```bash
python -c "import nltk; nltk.download('punkt'); nltk.download('brown')"
```

---

## 📞 Need Help?

- Check `README.md` for detailed documentation
- Review `DEPLOYMENT.md` for production setup
- Open an issue on GitHub

---

**Happy Coding! 🚀**

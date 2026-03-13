#!/bin/bash

# AI Ticketing System - Quick Setup Script
# This script automates the setup process for both backend and frontend

echo "🎫 AI Ticketing System - Setup Script"
echo "======================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Python and Node.js detected"
echo ""

# Backend Setup
echo "📦 Setting up Backend..."
cd backend

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Copy environment file
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update .env file with your database credentials"
fi

# Download NLTK data
echo "Downloading NLP data..."
python -c "import nltk; nltk.download('punkt', quiet=True); nltk.download('brown', quiet=True)"

echo "✅ Backend setup complete!"
echo ""

# Frontend Setup
echo "📦 Setting up Frontend..."
cd ../frontend

# Install Node dependencies
echo "Installing Node.js dependencies..."
npm install

echo "✅ Frontend setup complete!"
echo ""

# Final instructions
echo "======================================"
echo "✅ Setup Complete!"
echo ""
echo "Next Steps:"
echo "1. Configure PostgreSQL database"
echo "2. Update backend/.env with your database credentials"
echo "3. Run migrations: cd backend && python manage.py migrate"
echo "4. Create superuser: python manage.py createsuperuser"
echo "5. Start backend: python manage.py runserver"
echo "6. In another terminal, start frontend: cd frontend && npm start"
echo ""
echo "📚 See README.md for detailed instructions"
echo "======================================"

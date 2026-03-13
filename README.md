# 🎫 AI-Integrated RESTful Ticketing System

A full-stack ticketing system with **AI-powered sentiment analysis** for automatic ticket prioritization, built with React.js, Django REST Framework, and PostgreSQL.

## 🚀 Features

### Core Functionality
- ✅ **Full-stack RESTful API** - Django REST Framework backend with React.js frontend
- ✅ **Automated Ticket Creation** - RESTful endpoints for CRUD operations
- ✅ **Status Tracking** - Real-time ticket status management (Open, In Progress, Resolved, Closed)
- ✅ **User Management** - User authentication and role-based access

### AI/NLP Features
- 🤖 **Sentiment Analysis** - TextBlob-based sentiment scoring of ticket content
- 🎯 **Auto-Prioritization** - Intelligent ticket priority assignment based on NLP analysis
- 📊 **Keyword Detection** - Identifies urgency indicators (urgent, critical, ASAP, etc.)
- 🔄 **Auto-Routing** - Automatic ticket assignment to best available agent

### Additional Features
- 💬 **Comment System** - Threaded discussions on tickets
- 📜 **History Tracking** - Complete audit trail of all ticket changes
- 📈 **Dashboard & Analytics** - Real-time statistics and insights
- 🔍 **Advanced Filtering** - Search and filter by status, priority, category
- 🎨 **Modern UI** - Responsive design with intuitive interface

---

## 🛠️ Tech Stack

### Backend
- **Framework:** Django 4.2.7
- **API:** Django REST Framework 3.14.0
- **Database:** PostgreSQL
- **NLP:** TextBlob, NLTK
- **CORS:** django-cors-headers

### Frontend
- **Framework:** React.js 18.2.0
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Styling:** Custom CSS

---

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL 12+
- Git

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ai-ticketing-system.git
cd ai-ticketing-system
```

### 2. Backend Setup

#### Create Virtual Environment

```bash
cd backend
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

#### Install Dependencies

```bash
pip install -r requirements.txt
```

#### Setup PostgreSQL Database

```sql
-- Create database
CREATE DATABASE ticketing_db;

-- Create user (optional)
CREATE USER ticketing_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ticketing_db TO ticketing_user;
```

#### Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=ticketing_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

#### Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

#### Create Superuser

```bash
python manage.py createsuperuser
```

#### Download NLP Data

```bash
python -c "import nltk; nltk.download('punkt'); nltk.download('brown')"
```

#### Start Backend Server

```bash
python manage.py runserver
```

Backend will run at: `http://localhost:8000`

### 3. Frontend Setup

#### Install Dependencies

```bash
cd frontend
npm install
```

#### Configure Environment (Optional)

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

#### Start Frontend Development Server

```bash
npm start
```

Frontend will run at: `http://localhost:3000`

---

## 🎯 API Endpoints

### Tickets

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tickets/` | List all tickets |
| POST | `/api/tickets/` | Create new ticket (with AI analysis) |
| GET | `/api/tickets/{id}/` | Get ticket details |
| PATCH | `/api/tickets/{id}/` | Update ticket |
| DELETE | `/api/tickets/{id}/` | Delete ticket |
| GET | `/api/tickets/my_tickets/` | Get user's tickets |
| GET | `/api/tickets/assigned_to_me/` | Get assigned tickets |
| GET | `/api/tickets/statistics/` | Get ticket statistics |
| POST | `/api/tickets/{id}/auto_route/` | Auto-assign to best agent |
| POST | `/api/tickets/{id}/reanalyze/` | Re-run NLP analysis |

### Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/comments/` | List comments (filter by ticket_id) |
| POST | `/api/comments/` | Create comment |
| DELETE | `/api/comments/{id}/` | Delete comment |

### History

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/history/` | Get ticket history (filter by ticket_id) |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/` | List all users |
| GET | `/api/users/me/` | Get current user |
| GET | `/api/users/agents/` | Get all agents (staff users) |

---

## 🤖 NLP/AI Features Explained

### 1. Sentiment Analysis

The system analyzes ticket content using **TextBlob** to determine sentiment:

- **Score Range:** -1.0 (very negative) to +1.0 (very positive)
- **Usage:** Helps identify frustrated or urgent customers
- **Example:** "The system is completely broken!" → Negative sentiment → Higher priority

### 2. Auto-Prioritization

Combines multiple factors:

```python
# Priority Logic
- Critical: 2+ urgent keywords OR sentiment ≤ -0.5
- High: 1 urgent keyword OR 2+ priority keywords OR sentiment ≤ -0.3
- Medium: 1 priority keyword OR sentiment ≤ -0.1
- Low: Default
```

### 3. Urgency Keywords Detected

**Critical Keywords:**
- urgent, asap, immediately, critical, emergency, broken, down, not working, crashed, error, production, security breach, etc.

**High Priority Keywords:**
- important, soon, priority, issue, problem, bug, blocked, stuck, deadline, etc.

### 4. Category Suggestion

AI suggests categories based on content:
- **Technical:** error, bug, crash, API, database
- **Billing:** invoice, payment, charge, subscription
- **Bug Report:** bug, error, issue, wrong
- **Feature Request:** feature, add, new, suggestion

---

## 📱 Usage Guide

### Creating a Ticket

1. Click **"+ New Ticket"** in the navigation
2. Enter ticket details:
   - **Title:** Brief summary
   - **Description:** Detailed explanation (use urgency keywords for auto-prioritization)
   - **Priority:** Optional (AI will suggest)
   - **Category:** Optional (AI will suggest)
3. Click **"Create Ticket"**
4. AI automatically analyzes and assigns priority

### Managing Tickets

- **View All:** Navigate to "All Tickets"
- **Filter:** Use status, priority, category, and search filters
- **Update:** Click on a ticket to view details and edit
- **Auto-Route:** Click "Auto-Route" to assign to the best available agent
- **Re-Analyze:** Click "Re-Analyze" to run AI analysis again

### Adding Comments

1. Open ticket details
2. Scroll to comments section
3. Type your comment
4. Click "Add Comment"

---

## 🧪 Testing with Postman

### Import Collection

1. Open Postman
2. Import the following endpoints as a collection

### Example Requests

#### Create Ticket (with AI Analysis)

```http
POST http://localhost:8000/api/tickets/
Content-Type: application/json

{
  "title": "URGENT: Production server is down!",
  "description": "The main production server crashed and users cannot access the application. This is critical and needs immediate attention!",
  "created_by_id": 1
}
```

**Response:** Ticket with auto-assigned "critical" priority and negative sentiment score

#### Get Statistics

```http
GET http://localhost:8000/api/tickets/statistics/
```

#### Auto-Route Ticket

```http
POST http://localhost:8000/api/tickets/5/auto_route/
```

---

## 🔐 Admin Panel

Access Django Admin at: `http://localhost:8000/admin`

**Features:**
- Manage tickets, comments, users
- View ticket history
- See AI analysis results

---

## 📂 Project Structure

```
ai-ticketing-system/
├── backend/
│   ├── ticketing_system/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── tickets/
│   │   ├── models.py          # Database models
│   │   ├── serializers.py     # DRF serializers
│   │   ├── views.py           # API views
│   │   ├── urls.py            # URL routing
│   │   ├── admin.py           # Admin configuration
│   │   └── nlp_service.py     # NLP/AI logic
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js
│   │   │   ├── TicketList.js
│   │   │   ├── TicketDetail.js
│   │   │   ├── CreateTicket.js
│   │   │   └── Header.js
│   │   ├── services/
│   │   │   └── api.js         # API service
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

---

## 🚀 Deployment

### Backend (Heroku/Railway)

1. Set environment variables
2. Configure PostgreSQL database
3. Run migrations: `python manage.py migrate`
4. Collect static files: `python manage.py collectstatic`
5. Start with gunicorn: `gunicorn ticketing_system.wsgi`

### Frontend (Vercel/Netlify)

1. Build: `npm run build`
2. Deploy `build` folder
3. Set environment variable: `REACT_APP_API_URL`

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- Django REST Framework Documentation
- React.js Documentation
- TextBlob NLP Library
- Anthropic Claude (for assistance)

---

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Email: your.email@example.com

---

**⭐ If you find this project useful, please consider giving it a star!**

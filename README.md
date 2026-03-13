# 🎓 College Event Portal

A full-stack web application that allows colleges to manage and participate in campus events from a single platform.
Students can browse and register for events while administrators can create and manage events with limited seat capacity.

This project was built as a **hackathon prototype** using modern full-stack technologies.

---

# 🚀 Features

## 👩‍🎓 Student Features

* Sign up using college email
* Secure login authentication
* View all upcoming college events
* Search and filter events by club or type
* Register for events with limited seats
* View registered events in user profile
* Calendar view of upcoming events
* Real-time seat availability indicator

## 🧑‍💼 Admin Features

* Admin login access
* Create and publish new events
* Set event details (club, venue, seats, etc.)
* Track number of registrations
* Monitor upcoming events

---

# 🧠 Problem Solved

In many colleges, event information is scattered across WhatsApp groups, posters, and social media.
Students often miss opportunities or face overbooking issues.

This system provides:

* **Centralized event platform**
* **Seat-limited registrations**
* **Admin event management**
* **Structured event discovery**

---

# 🏗️ Tech Stack

## Frontend

* React (Vite)
* HTML5
* CSS3
* JavaScript

## Backend

* FastAPI (Python)

## Database

* Supabase (PostgreSQL)

## Other Tools

* Uvicorn
* Fetch API
* dotenv

---

# ⚙️ System Architecture

```
React Frontend
       ↓
FastAPI Backend
       ↓
Supabase Database
```

### Data Flow

1. Student signs up or logs in
2. FastAPI authenticates user
3. Supabase stores student data
4. Admin creates events
5. Students fetch events from backend
6. Students register for events
7. Database updates seat availability

---

# 📂 Project Structure

```
college-event-portal
│
├── backend
│   ├── main.py
│   └── .env
│
├── src
│   ├── components
│   │   ├── Navbar.jsx
│   │   ├── SignupModal.jsx
│   │   ├── LoginModal.jsx
│   │   ├── EventCard.jsx
│   │   └── Profile.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
│
├── package.json
└── README.md
```

---

# 🗄️ Database Schema

## Students Table

| Column        | Type    |
| ------------- | ------- |
| id            | integer |
| email         | text    |
| branch        | text    |
| semester      | text    |
| password_hash | text    |

---

## Events Table

| Column      | Type    |
| ----------- | ------- |
| id          | integer |
| title       | text    |
| club        | text    |
| description | text    |
| date        | text    |
| venue       | text    |
| seats       | integer |
| registered  | integer |

---

## Registrations Table

| Column     | Type    |
| ---------- | ------- |
| id         | integer |
| student_id | integer |
| event_id   | integer |

---

# 🔑 Authentication

### Student Login

Students register using their college email and password.

### Admin Login

Admin credentials are predefined for demo purposes:

```
Email: admin@college.edu
Password: Admin@2024
```

---

# 🛠️ Installation & Setup

## 1️⃣ Clone the Repository

```
git clone https://github.com/your-repo/college-event-portal.git
cd college-event-portal
```

---

## 2️⃣ Setup Backend

Install dependencies

```
pip install fastapi uvicorn supabase python-dotenv
```

Create `.env`

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

Run backend server

```
uvicorn main:app --reload
```

Backend runs on

```
http://127.0.0.1:8000
```

---

## 3️⃣ Setup Frontend

Install dependencies

```
npm install
```

Run frontend

```
npm run dev
```

Open browser

```
http://localhost:5173
```

---

# 📌 API Endpoints

## Student APIs

### Signup

```
POST /signup
```

### Login

```
POST /login
```

---

## Event APIs

### Create Event

```
POST /create-event
```

### Get Events

```
GET /events
```

---

# 📊 Future Improvements

* Email verification for student signup
* Role-based authentication
* Event image uploads
* Real-time seat locking
* Notifications for upcoming events
* Club-specific dashboards
* Event recommendation system


---

# 👩‍💻 Author

Developed as a hackathon project for building a **college-wide event management platform**.



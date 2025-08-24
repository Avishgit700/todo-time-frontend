# ⏱️ Todo + Pomodoro

A full-stack productivity app built with **FastAPI + React (Vite + Tailwind)**.  
Manage todos, track Pomodoros, export deadlines to your calendar.

![App Screenshot](frontend/public/og.png)

## ✨ Features
- 🔑 JWT Auth (login/register)
- ✅ Todos CRUD (priority, tags, due dates)
- 🕒 Pomodoro timer (start/stop, linked to tasks)
- 📊 Analytics (completed, pending, overdue, completion rate)
- 📅 Calendar export (`.ics`)
- 🌐 REST API with FastAPI

## 🚀 Run locally

### Backend
```bash
cd fastapi-backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

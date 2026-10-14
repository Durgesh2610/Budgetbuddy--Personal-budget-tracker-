# 💰 BudgetBuddy — Personal Budget Tracker

A full-stack personal budget tracker with a **React + Vite** frontend and a **Node.js / Express / MongoDB** backend. Containerized with Docker and automated via GitHub Actions CI/CD.

![CI](https://github.com/Durgesh2610/Budgetbuddy--Personal-budget-tracker-/actions/workflows/ci.yml/badge.svg)
![Docker Publish](https://github.com/Durgesh2610/Budgetbuddy--Personal-budget-tracker-/actions/workflows/docker-publish.yml/badge.svg)

---

## ✨ Features

- **User Auth** — Register & Login with JWT
- **Expense Tracking** — Add, view, and delete expenses
- **Category Filters** — Food, Transport, Shopping, Health, Education, Entertainment, Utilities
- **Dashboard** — Summary cards + Doughnut chart breakdown by category
- **Dark Theme** — Premium dark purple design

---

## 🗂️ Project Structure

```
Budgetbuddy/
├── backend/               # Node.js / Express API
│   ├── config/            # MongoDB connection
│   ├── controllers/       # Route handlers
│   ├── middleware/        # JWT auth middleware
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routers
│   ├── server.js
│   └── Dockerfile
├── frontend/              # React + Vite SPA
│   ├── src/
│   │   ├── context/       # AuthContext
│   │   ├── components/    # Navbar, PrivateRoute
│   │   ├── pages/         # Dashboard, Expenses, Login, Register
│   │   └── services/      # Axios API client
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
└── .github/workflows/
    ├── ci.yml             # Build & test on every push
    └── docker-publish.yml # Publish to GHCR on main merge
```

---

## 🚀 Local Development

### Prerequisites
- Node.js 20+
- MongoDB running locally (or use Docker Compose)

### Backend

```bash
cd backend
cp .env.example .env      # fill in MONGO_URI and JWT_SECRET
npm install
npm run dev               # starts on :5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev               # starts on :5173
```

---

## 🐳 Docker (Full Stack)

```bash
# From repo root
cp .env.example .env      # set JWT_SECRET (MONGO_URI defaults to local mongo)
docker compose up --build

# Frontend → http://localhost
# Backend  → http://localhost:5000
# Health   → http://localhost:5000/health
```

---

## 🔐 Environment Variables

### Backend `.env`
| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | API server port |
| `MONGO_URI` | `mongodb://mongo:27017/budgetbuddy` | MongoDB connection string |
| `JWT_SECRET` | — | **Required.** JWT signing secret |
| `CLIENT_ORIGIN` | `*` | Allowed CORS origin |

---

## ⚙️ CI/CD — GitHub Actions

### Workflows

| File | Trigger | What it does |
|---|---|---|
| `ci.yml` | Every push / PR | Backend syntax check + Frontend Vite build |
| `docker-publish.yml` | Push to `main` | Build & push images to GHCR |

### Published Images (GHCR)

After the Docker workflow runs on `main`, images are available at:

```
ghcr.io/durgesh2610/budgetbuddy-backend:latest
ghcr.io/durgesh2610/budgetbuddy-frontend:latest
```

> No additional secrets needed — the workflow uses the built-in `GITHUB_TOKEN`.

---

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/users/register` | ❌ | Create account |
| POST | `/api/users/login` | ❌ | Get JWT token |
| GET | `/api/expenses` | ✅ | Get all expenses |
| POST | `/api/expenses` | ✅ | Add expense |
| DELETE | `/api/expenses/:id` | ✅ | Delete expense |
| GET | `/health` | ❌ | Health check |

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, Chart.js, React Router v7 |
| Backend | Node.js 20, Express 5, Mongoose 8, JWT |
| Database | MongoDB 7 |
| Container | Docker, Docker Compose, Nginx |
| CI/CD | GitHub Actions → GHCR |

# CargoLoop

**Turning Empty Miles Into Opportunity**

CargoLoop is a logistics backhaul matching platform built for FAR AWAY 2026 (Logistics & Transit theme). It connects shippers with trucks that have spare capacity on return trips — reducing empty kilometers, cutting CO₂, and increasing fleet utilization.

## Auth & Roles

| Role | Permissions |
|------|-------------|
| **shipper** | Create loads, run matches, view analytics |
| **carrier** | Register vehicles, run matches, view analytics |
| **admin** | Full access (demo / ops) |

- Email/password login (JWT, StudyBuddy-style)
- **Google OAuth** — same credentials as StudyBuddy project
- PWA installable on mobile with splash screen

### Demo logins (after `python -m scripts.seed_demo`)

| Email | Password | Role |
|-------|----------|------|
| shipper@cargoloop.demo | Test1234 | shipper |
| carrier@cargoloop.demo | Test1234 | carrier |
| admin@cargoloop.demo | Test1234 | admin |

### Google OAuth setup

Add this redirect URI in [Google Cloud Console](https://console.cloud.google.com/):

```
http://localhost:8000/auth/google/callback
```

Copy `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` from StudyBuddy's `backend/.env` into CargoLoop's `backend/.env`.

## MVP Features

1. Create shipment requests (loads)
2. Register available vehicles
3. Run the matching engine to find the best vehicle
4. AI explains why that vehicle was selected (Gemini or smart fallback)
5. Impact analytics dashboard (revenue, empty KM saved, CO₂, utilization)
6. Live map with loads, vehicles, and matched route

## Tech Stack

| Layer    | Stack                          |
|----------|--------------------------------|
| Frontend | React, Vite, Tailwind CSS, react-leaflet |
| Backend  | FastAPI, Motor (MongoDB async) |
| Database | MongoDB Atlas                  |
| AI       | Google Gemini (optional)       |

## Project Structure

```
cargoloop/
├── backend/
│   └── app/
│       ├── main.py
│       ├── routes/      # loads, vehicles, matches, analytics
│       ├── services/    # matching, scoring, ai_explainer
│       ├── database/    # MongoDB connection
│       └── models/      # Pydantic schemas
└── frontend/
    └── src/
        ├── pages/       # Dashboard, Loads, Vehicles, Matches, Analytics
        ├── components/  # Cards, MapView
        └── services/    # API client
```

## Setup

### Prerequisites

- Node.js 18+
- Python 3.11+
- MongoDB Atlas cluster (free tier works)

### 1. MongoDB Atlas

1. Create a cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Add a database user and allow your IP in Network Access
3. Copy the connection string

### 2. Backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Edit .env with your MONGODB_URI and optional GEMINI_API_KEY

uvicorn app.main:app --reload --port 8000
```

Seed demo data for the hackathon pitch:

```bash
cd backend
python -m scripts.seed_demo
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## API Endpoints

| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| POST   | `/loads`              | Create shipment          |
| GET    | `/loads`              | List shipments           |
| POST   | `/vehicles`           | Register vehicle         |
| GET    | `/vehicles`           | List vehicles            |
| POST   | `/matches/generate`   | Run matching engine      |
| GET    | `/matches`            | List past matches        |
| GET    | `/analytics/summary`  | Impact metrics           |
| GET    | `/health`             | Health check             |

## Demo Flow (for judges)

1. Seed demo data or manually add: **200kg Mangoes, Nashik → Mumbai**
2. Register 3 vehicles (Pune→Mumbai cold truck scores highest)
3. Go to **Matches** → click **Find Best Match**
4. See score breakdown + AI explanation
5. Map highlights the selected route
6. **Analytics** updates with impact metrics

## Matching Engine

```
score = capacity×0.35 + route×0.30 + reliability×0.20 + distance×0.15 + cargo bonus
```

Factors: capacity fit, destination overlap, proximity to pickup, driver reliability, cold-chain compatibility for perishables.

## License

MIT

<h1 align="center">
  <br>
  <img src="./frontend/public/cargo_logo.png" alt="CargoLoop" width="120" style="border-radius: 20px; box-shadow: 0 0 20px rgba(14,165,233,0.5);">
  <br>
  CargoLoop
  <br>
</h1>

<h4 align="center">Turning Empty Miles Into Opportunity.</h4>

<p align="center">
  <b>FAR AWAY 2026 Hackathon Submission • Logistics & Transit Track</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Live-success?style=for-the-badge&logo=vercel" alt="Status Live">
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/FastAPI-0.104-009688?style=for-the-badge&logo=fastapi" alt="FastAPI">
  <img src="https://img.shields.io/badge/AI-Gemini_Pro-orange?style=for-the-badge&logo=google" alt="Google Gemini">
</p>

<p align="center">
  <a href="#the-problem">The Problem</a> •
  <a href="#the-solution">The Solution</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#demo-flow-for-judges">Demo Flow</a>
</p>

---

## 🚨 The Problem: The Hidden Cost of Empty Miles

The logistics industry is bleeding margins due to structural inefficiencies:
- **35% of trucks** return empty after completing deliveries.
- **₹0 Revenue** is generated on these return trips.
- Rising fuel prices make these empty journeys financially painful.
- Businesses struggle to find transportation while nearby trucks drive empty.

*Every Empty Truck Is A Lost Opportunity.*

---

## 💡 The Solution: CargoLoop

**CargoLoop** is an **AI-Powered Backhaul Optimization Platform**. We intelligently match available truck capacity with nearby shipment demand, helping carriers earn more while reducing logistics waste.

By optimizing backhaul capacity, CargoLoop:
1. **Reduces deadhead miles**
2. **Cuts CO₂ emissions** and issues trackable **Green Credits**
3. **Maximizes fleet utilization** 
4. Provides a stunning, high-performance web application experience.

---

## ✨ Key Features

### 🚀 Agentic Dispatcher (Powered by Gemini AI)
Ditch manual data entry. Shippers simply type natural language requests (e.g., *"I need to move 5 tons of temperature-sensitive vaccines from Delhi to Mumbai tomorrow"*). Our AI instantly extracts the cargo type, urgency, weight, and geocodes the coordinates to dispatch the load.

### 🧠 Autonomous Match Engine
Our proprietary algorithm evaluates capacity fit, route proximity, driver reliability, and cold-chain requirements to automatically match shipments to the most optimal empty fleet. An **AI Explainer** breaks down exactly *why* a truck was chosen.

### 🌍 Live Global Radar & Predictive Risk AI
A real-time interactive map visualizes active loads and fleet movements. A predictive risk engine proactively flags potential disruptions (e.g., heavy monsoons, border congestion) and suggests AI rerouting.

### 🌿 Carbon Tokenization & Green Credits
Real-time tracking of Empty KM saved dynamically calculates CO₂ emission reductions, displaying the generated Green Credits in a beautiful, interactive dashboard.

### 🛡️ Enterprise Trust & Verification
A complete governance suite. Carriers register their vehicles by providing Verification Proofs (RC/Docs). Admins review pending fleets, assign AI Trust Scores, and manage users from a dedicated Control Center.

---

## 🛠️ Tech Stack

### Frontend (The Visual Experience)
* **Core:** React 18, Vite, React Router DOM
* **Styling:** Tailwind CSS (Custom themes, Glassmorphism, Neon UI)
* **Animation:** Framer Motion (Micro-interactions, Page transitions)
* **Maps & Charts:** React-Leaflet, Recharts
* **Icons:** Lucide React

### Backend (The Brains)
* **Core:** FastAPI (High performance, async Python)
* **Database:** MongoDB Atlas (Motor Async driver)
* **AI:** Google Gemini AI SDK (Natural Language Parsing & Explanations)
* **Security:** PyJWT, bcrypt, Google OAuth Integration

---

## 🎯 Demo Flow (For Judges)

To evaluate CargoLoop, follow this exact sequence to experience the full platform:

1. **The "Wow" Introduction:** Start at the `/` landing page. Notice the premium aesthetics, live animated metrics, and compelling problem-driven narrative.
2. **Admin Verification:** Log in as `admin@cargoloop.demo` (Password: `admin1234`). Show the **User Management** screen, then go to **Verification** to approve a pending truck.
3. **Agentic Dispatching:** Log in as `shipper@cargoloop.demo`. Go to the **Command Center**. Type: *"I need to move 5 tons of temperature-sensitive vaccines from Delhi to Mumbai tomorrow"* into the AI box. Watch it instantly parse!
4. **The Match:** Go to **Autonomous Match**. Click "Find Best Match". See how the algorithm instantly pairs the load with a verified Cold-Storage truck, complete with an AI-generated explanation.
5. **The Impact:** Finally, navigate to **Impact Data** to view the live charts displaying Empty KM Saved and CO₂ Green Credits earned.

---

## ⚙️ Local Setup

### 1. Backend Setup
```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate | macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env # Add your MONGODB_URI and GEMINI_API_KEY
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env # Add VITE_API_URL=http://localhost:8000
npm run dev
```

---
<p align="center">
  <i>Built by Team StackStorm for FAR AWAY 2026</i>
</p>

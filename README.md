<h1 align="center">
  <br>
  <img src="./frontend/public/cargo_logo.png" alt="CargoLoop" width="120" style="border-radius: 20px; box-shadow: 0 0 20px rgba(14,165,233,0.5);">
  <br>
  CargoLoop
  <br>
</h1>

<h4 align="center">Logistics intelligence, fully autonomous. Turning empty miles into opportunity.</h4>

<p align="center">
  <a href="#vision">Vision</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#the-workflow">The Workflow</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#setup--installation">Installation</a> •
  <a href="#demo-flow-for-judges">Demo Flow</a>
</p>

---

## Vision

**CargoLoop** is an enterprise-grade logistics and transit matching platform built for **FAR AWAY 2026**. 

The logistics industry loses billions of dollars and generates massive unnecessary carbon emissions due to **"deadhead miles"**—trucks driving empty on their return trips. CargoLoop solves this by seamlessly connecting shippers with spare carrier capacity using an **Autonomous Match Engine** and an **Agentic AI Dispatcher**.

By optimizing backhaul capacity, CargoLoop reduces deadhead miles, cuts CO₂ emissions (issuing Green Credits), and maximizes fleet utilization—all wrapped in a stunning, high-performance web application.

---

## Key Features

🚀 **Agentic Dispatcher (Powered by Gemini AI)**
Ditch manual data entry. Shippers can simply type natural language requests (e.g., *"I need to move 5 tons of temperature-sensitive vaccines from Delhi to Mumbai tomorrow"*), and our AI agent instantly extracts the cargo type, urgency, weight, and precisely geocodes the pickup and drop-off coordinates to dispatch the load!

🧠 **Autonomous Match Engine**
Our proprietary algorithm evaluates capacity fit, route proximity (using Haversine distance), driver reliability, and cold-chain requirements to automatically match shipments to the most optimal empty fleet. An **AI Explainer** breaks down exactly why a truck was chosen.

🌍 **Live Global Radar & Predictive Risk AI**
A real-time interactive map visualizes active loads and fleet movements. A predictive risk engine proactively flags potential disruptions (e.g., heavy monsoons, border congestion) and suggests AI rerouting.

🌿 **Carbon Tokenization & Green Credits**
Real-time tracking of Empty KM saved dynamically calculates CO₂ emission reductions, displaying the generated Green Credits in a beautiful, interactive Area Chart.

🛡️ **Admin Verification & User Management**
A complete enterprise governance suite. Carriers register their vehicles by providing Verification Proofs (RC/Docs). Admins review pending fleets, assign AI Trust Scores, and manage all users (promotions, suspensions) from a dedicated Admin Control Center.

✨ **Next-Gen Cyber Aesthetics**
A breathtaking UI featuring Glassmorphism, tailored neon color palettes (Cyan & Emerald), dynamic particle networks, and a "Cyber Truck" motion-effect Auth screen that provides an unforgettable user experience.

---

## The Workflow

CargoLoop features three distinct user journeys operating in perfect sync:

### 1. The Carrier Flow (Fleet Providers)
- Registers an account and heads to the **Fleet Hub**.
- Registers available fleet capacity, specifying pickup/drop-off destinations, cold-storage capabilities, and linking their **Verification Proof (RC Document)**.
- Waits for Admin verification and the assignment of a Trust Score.
- Automatically receives autonomous matches for their empty return trips!

### 2. The Admin Flow (Platform Operators)
- Logs into the exclusive **Admin Command Center** (The Global Radar).
- Accesses the **Verification Panel** to review pending Carrier registrations, inspect linked documents, and Approve/Reject vehicles.
- Uses the **User Management** panel to oversee all Shippers and Carriers, suspending malicious actors or promoting ops team members.

### 3. The Shipper Flow (Freight Senders)
- Accesses the **Dispatch** interface and types their requirement into the **Agentic Dispatcher**.
- The AI autonomously creates the load and plots it on the map.
- Navigates to the **Autonomous Match** engine to instantly find the best verified carrier for their load.
- Views the **Impact Data** dashboard to see the Revenue Generated and Green Credits earned.

---

## Tech Stack

**Frontend (The Visual Experience)**
* **Core:** React 18, Vite, React Router DOM
* **Styling:** Tailwind CSS (Custom themes, Glassmorphism, Custom Scrollbars)
* **Animation:** Framer Motion (Micro-interactions, Cyber Truck Auth effects)
* **Maps & Charts:** React-Leaflet, Recharts
* **Icons:** Lucide React

**Backend (The Brains)**
* **Core:** FastAPI (High performance, async python)
* **Database:** MongoDB Atlas (Motor Async driver)
* **AI:** Google Gemini AI SDK (Natural Language Parsing & Explanations)
* **Security:** PyJWT, bcrypt, Google OAuth Integration

---

## Setup & Installation

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB Atlas cluster URL
- Google Gemini API Key

### 1. Backend Setup
```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
```
*Edit `.env` to include your `MONGODB_URI` and `GEMINI_API_KEY`.*

```bash
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
```
*Edit `.env` to include `VITE_API_URL=http://localhost:8000`.*

```bash
npm run dev
```

---

## Demo Flow (For Judges)

To make the best impression during your pitch, follow this exact sequence:

1. **The "Wow" Introduction:** Start at the `/login` screen. Let the judges appreciate the Cyber Truck motion effects and the premium dark-mode aesthetics.
2. **Admin Verification:** Log in as `admin@cargoloop.demo` (Password: `admin1234`). Show the **User Management** screen, then go to **Verification** to approve a pending truck (showing the "View Document" feature).
3. **Agentic Dispatching:** Log in as `shipper@cargoloop.demo`. Go to the **Command Center**. Type: *"I need to move 5 tons of temperature-sensitive vaccines from Delhi to Mumbai tomorrow"* into the AI box. Watch it instantly parse and redirect to the Map!
4. **The Match:** Go to **Autonomous Match**. Click "Find Best Match". Show how the algorithm instantly pairs the vaccine load with a verified Cold-Storage truck, complete with an AI-generated explanation.
5. **The Impact:** Finally, navigate to **Impact Data** to show the live charts displaying Empty KM Saved and CO₂ Green Credits earned. 

*CargoLoop — Enterprise Grade. FAR AWAY 2026.*

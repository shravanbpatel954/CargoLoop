from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.mongodb import close_db, connect_db
from app.routes import analytics, auth, loads, matches, vehicles, users, capacity_listings


from datetime import datetime, timezone
from app.services.auth import hash_password

async def seed_admin():
    from app.database.mongodb import get_db
    db = get_db()
    existing = await db.users.find_one({"email": "admin@cargoloop.com"})
    if not existing:
        await db.users.insert_one({
            "name": "CargoLoop Admin",
            "email": "admin@cargoloop.com",
            "password": hash_password("admin1234"),
            "role": "admin",
            "authMethods": ["email"],
            "createdAt": datetime.now(timezone.utc),
        })
        print("Admin user seeded.")

import asyncio
from fastapi import WebSocket, WebSocketDisconnect
from app.services.ws_manager import manager
from app.agents import autonomous_matcher

@asynccontextmanager
async def lifespan(_: FastAPI):
    await connect_db()
    await seed_admin()
    asyncio.create_task(autonomous_matcher.run_loop())
    yield
    await close_db()


import os

app = FastAPI(
    title="CargoLoop API",
    description="Turning empty miles into opportunity — Logistics & Transit matching engine",
    version="1.0.0",
    lifespan=lifespan,
)

cors_origins_str = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,https://cargo-loop.onrender.com")
cors_origins = [origin.strip() for origin in cors_origins_str.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(loads.router, prefix="/loads", tags=["loads"])
app.include_router(vehicles.router, prefix="/vehicles", tags=["vehicles"])
app.include_router(capacity_listings.router, prefix="/capacity-listings", tags=["capacity_listings"])
app.include_router(matches.router, prefix="/matches", tags=["matches"])
app.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
app.include_router(users.router, prefix="/users", tags=["users"])

@app.websocket("/ws/agent")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "cargoloop"}

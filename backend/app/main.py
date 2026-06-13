from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.mongodb import close_db, connect_db
from app.routes import analytics, auth, loads, matches, vehicles


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

@asynccontextmanager
async def lifespan(_: FastAPI):
    await connect_db()
    await seed_admin()
    yield
    await close_db()


app = FastAPI(
    title="CargoLoop API",
    description="Turning empty miles into opportunity — Logistics & Transit matching engine",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(loads.router, prefix="/loads", tags=["loads"])
app.include_router(vehicles.router, prefix="/vehicles", tags=["vehicles"])
app.include_router(matches.router, prefix="/matches", tags=["matches"])
app.include_router(analytics.router, prefix="/analytics", tags=["analytics"])


@app.get("/health")
async def health():
    return {"status": "ok", "service": "cargoloop"}

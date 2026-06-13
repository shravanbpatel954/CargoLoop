"""Seed demo data and users for hackathon presentation."""

import asyncio
from datetime import datetime, timezone

from motor.motor_asyncio import AsyncIOMotorClient

from app.config import settings
from app.services.auth import hash_password

DEMO_USERS = [
    {
        "name": "Demo Shipper",
        "email": "shipper@cargoloop.demo",
        "password": "Test1234",
        "role": "shipper",
    },
    {
        "name": "Demo Carrier",
        "email": "carrier@cargoloop.demo",
        "password": "Test1234",
        "role": "carrier",
    },
    {
        "name": "Demo Admin",
        "email": "admin@cargoloop.demo",
        "password": "Test1234",
        "role": "admin",
    },
]

DEMO_LOADS = [
    {
        "pickup": "Nashik",
        "drop": "Mumbai",
        "weight": 200,
        "cargoType": "Perishable",
        "urgency": "High",
    },
    {
        "pickup": "Pune",
        "drop": "Mumbai",
        "weight": 450,
        "cargoType": "General",
        "urgency": "Medium",
    },
]

DEMO_VEHICLES = [
    {
        "vehicleNumber": "MH12AB1234",
        "currentLocation": "Pune",
        "destination": "Mumbai",
        "availableCapacity": 500,
        "coldStorage": True,
        "reliability": 96,
    },
    {
        "vehicleNumber": "MH14CD5678",
        "currentLocation": "Nashik",
        "destination": "Pune",
        "availableCapacity": 800,
        "coldStorage": False,
        "reliability": 88,
    },
    {
        "vehicleNumber": "MH01EF9012",
        "currentLocation": "Mumbai",
        "destination": "Nagpur",
        "availableCapacity": 600,
        "coldStorage": True,
        "reliability": 92,
    },
]


async def seed() -> None:
    client = AsyncIOMotorClient(settings.mongodb_uri)
    db = client[settings.database_name]
    now = datetime.now(timezone.utc)

    await db.users.delete_many({"email": {"$regex": "@cargoloop.demo$"}})
    await db.loads.delete_many({})
    await db.vehicles.delete_many({})
    await db.matches.delete_many({})

    for user in DEMO_USERS:
        await db.users.insert_one(
            {
                "name": user["name"],
                "email": user["email"],
                "password": hash_password(user["password"]),
                "role": user["role"],
                "authMethods": ["email"],
                "createdAt": now,
            }
        )

    for load in DEMO_LOADS:
        load["createdAt"] = now
        await db.loads.insert_one(load)

    for vehicle in DEMO_VEHICLES:
        vehicle["createdAt"] = now
        await db.vehicles.insert_one(vehicle)

    print("Seeded 3 demo users, 2 loads, 3 vehicles")
    print("Login: shipper@cargoloop.demo | carrier@cargoloop.demo | admin@cargoloop.demo")
    print("Password (StudyBuddy test pattern): Test1234")
    client.close()


if __name__ == "__main__":
    asyncio.run(seed())

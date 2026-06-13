import asyncio
from datetime import datetime, timezone
import os
import sys

# Add backend directory to path so we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.mongodb import connect_db, get_db, close_db
from app.services.auth import hash_password

async def seed_demo():
    await connect_db()
    db = get_db()
    
    print("Clearing old demo data...")
    await db.loads.delete_many({})
    await db.vehicles.delete_many({})
    await db.capacity_listings.delete_many({})
    await db.matches.delete_many({})
    await db.users.delete_many({"email": {"$ne": "admin@cargoloop.com"}})

    print("Seeding Shipper: Balasaheb Shinde...")
    shipper = {
        "name": "Balasaheb Shinde",
        "email": "balasaheb@cargoloop.com",
        "password": hash_password("demo1234"),
        "role": "shipper",
        "trustScore": 95.0,
        "createdAt": datetime.now(timezone.utc)
    }
    shipper_result = await db.users.insert_one(shipper)
    shipper_id = shipper_result.inserted_id

    print("Seeding Load: 300kg Alphonso Mangoes...")
    load = {
        "createdBy": str(shipper_id),
        "pickup": "Sinnar, Nashik",
        "pickupLat": 19.85,
        "pickupLng": 74.00,
        "drop": "APMC Vashi, Navi Mumbai",
        "dropLat": 19.07,
        "dropLng": 73.00,
        "weight": 300,
        "cargoType": "perishable_fruit",
        "urgency": "HIGH",
        "createdAt": datetime.now(timezone.utc)
    }
    await db.loads.insert_one(load)

    carriers_data = [
        {
            "name": "Ramesh Kumar", "email": "ramesh@cargoloop.com", "trustScore": 84.2,
            "vehicleNumber": "MH-12-AB-1234", "maxCapacityKg": 5000, "coldStorage": True,
            "loc": "Nashik", "dest": "Mumbai", "locLat": 19.78, "locLng": 73.89, "avail": 2000
        },
        {
            "name": "Suresh Patil", "email": "suresh@cargoloop.com", "trustScore": 71.0,
            "vehicleNumber": "MH-04-CD-5678", "maxCapacityKg": 3000, "coldStorage": False,
            "loc": "Nasik", "dest": "Pune", "locLat": 19.91, "locLng": 74.15, "avail": 1500
        },
        {
            "name": "Dinesh Yadav", "email": "dinesh@cargoloop.com", "trustScore": 52.0,
            "vehicleNumber": "GJ-01-EF-9012", "maxCapacityKg": 1000, "coldStorage": False,
            "loc": "Nashik", "dest": "Surat", "locLat": 20.24, "locLng": 73.65, "avail": 800
        }
    ]

    print("Seeding Carriers, Vehicles, and Capacity Listings...")
    for c in carriers_data:
        carrier = {
            "name": c["name"],
            "email": c["email"],
            "password": hash_password("demo1234"),
            "role": "carrier",
            "trustScore": c["trustScore"],
            "createdAt": datetime.now(timezone.utc)
        }
        res = await db.users.insert_one(carrier)
        carrier_id = res.inserted_id

        vehicle = {
            "createdBy": str(carrier_id),
            "vehicleNumber": c["vehicleNumber"],
            "vehicleType": "Truck",
            "maxCapacityKg": c["maxCapacityKg"],
            "coldStorage": c["coldStorage"],
            "rcVerified": True,
            "insuranceVerified": True,
            "status": "verified",
            "reliability": 85.0,
            "createdAt": datetime.now(timezone.utc)
        }
        v_res = await db.vehicles.insert_one(vehicle)
        v_id = v_res.inserted_id

        listing = {
            "vehicleId": str(v_id),
            "currentLocation": c["loc"],
            "currentLat": c["locLat"],
            "currentLng": c["locLng"],
            "destination": c["dest"],
            "availableCapacityKg": c["avail"],
            "departureTime": datetime.now(timezone.utc),
            "status": "active",
            "createdAt": datetime.now(timezone.utc)
        }
        await db.capacity_listings.insert_one(listing)

    print("Demo Data Seeded Successfully!")
    print("Run the frontend and wait 60 seconds for the autonomous matcher cycle to begin.")
    
    await close_db()

if __name__ == "__main__":
    asyncio.run(seed_demo())

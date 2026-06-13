import asyncio
from datetime import datetime, timezone
import json

from app.database.mongodb import get_db
from app.services.scoring import composite_score
from app.services.ws_manager import manager
from app.services.ai_explainer import explain_match

from app.services.trust_engine import recalculate_carrier_trust

async def generate_explanation(load: dict, listing: dict, vehicle: dict, score: float, breakdown: dict) -> str:
    explanation = await explain_match(load, listing, vehicle, score, breakdown)
    # Simplify format for live feed if it has bullet points
    lines = explanation.split('\n')
    clean = " ".join([l.replace("•", "").strip() for l in lines if l.strip()])
    return clean

async def run_loop():
    print("Autonomous Match Agent Loop Started...")
    while True:
        await asyncio.sleep(60)  # Runs every 60 seconds
        try:
            db = get_db()
            if db is None:
                continue

            matches_cursor = db.matches.find({})
            matched_load_ids = [str(m["loadId"]) async for m in matches_cursor]
            
            unmatched_loads = [doc async for doc in db.loads.find({"_id": {"$nin": matched_load_ids}})]
            if not unmatched_loads:
                continue
                
            listings = [doc async for doc in db.capacity_listings.find({"status": "active"})]
            if not listings:
                continue
                
            vehicles = {str(doc["_id"]): doc async for doc in db.vehicles.find({"status": "verified"})}
            users = {str(doc["_id"]): doc async for doc in db.users.find({})}

            def load_priority(load):
                prio = 0
                if load.get("urgency", "").upper() == "HIGH":
                    prio += 2
                cargo = load.get("cargoType", "").lower()
                if any(k in cargo for k in ["mango", "vegetable", "fruit", "dairy", "fish", "flower", "perishable"]):
                    prio += 1
                return prio

            unmatched_loads.sort(key=load_priority, reverse=True)

            for load in unmatched_loads:
                best_score = -1
                best_listing = None
                best_vehicle = None
                best_breakdown = None

                for listing in listings:
                    vehicle = vehicles.get(str(listing["vehicleId"]))
                    if not vehicle:
                        continue
                    
                    carrier = users.get(str(vehicle.get("createdBy", "")))
                    trust_score = carrier.get("trustScore", 80) if carrier else 80

                    score, breakdown = composite_score(
                        load_weight=load.get("weight", 0),
                        available_capacity=listing.get("availableCapacityKg", 0),
                        vehicle_destination=listing.get("destination", ""),
                        load_drop=load.get("drop", ""),
                        vehicle_location=listing.get("currentLocation", ""),
                        load_pickup=load.get("pickup", ""),
                        reliability=vehicle.get("reliability", 85),
                        cargo_type=load.get("cargoType", "cargo"),
                        cold_storage=vehicle.get("coldStorage", False),
                        carrier_trust=trust_score,
                        urgency_boost=1.4 if load_priority(load) > 0 else 1.0
                    )

                    if score > best_score:
                        best_score = score
                        best_listing = listing
                        best_vehicle = vehicle
                        best_breakdown = breakdown

                if best_score > 72:
                    # RECOMMENDED
                    explanation = await generate_explanation(load, best_listing, best_vehicle, best_score, best_breakdown)
                    
                    match_doc = {
                        "loadId": load["_id"],
                        "listingId": best_listing["_id"],
                        "vehicleId": best_vehicle["_id"],
                        "score": best_score,
                        "status": "pending_approval",
                        "breakdown": best_breakdown,
                        "explanation": explanation,
                        "createdAt": datetime.now(timezone.utc)
                    }
                    await db.matches.insert_one(match_doc)
                    
                    carrier_name = "Unknown"
                    if best_vehicle.get("createdBy"):
                        carrier = users.get(str(best_vehicle["createdBy"]))
                        if carrier:
                            carrier_name = carrier.get("name", "Unknown")
                            # Trigger trust recalculation since they got recommended
                            asyncio.create_task(recalculate_carrier_trust(str(carrier["_id"])))

                    await manager.broadcast({
                        "type": "match_made",
                        "score": best_score,
                        "load_details": f"{load['weight']}kg {load.get('cargoType')}, {load['pickup']} → {load['drop']}",
                        "carrier_details": f"{carrier_name} ({best_vehicle.get('vehicleNumber')})",
                        "explanation": f"Recommended match: {explanation} Carrier notified for approval."
                    })
                    
                elif 55 <= best_score <= 72:
                    # SUGGESTED
                    carrier_name = "Unknown"
                    if best_vehicle.get("createdBy"):
                        carrier = users.get(str(best_vehicle["createdBy"]))
                        if carrier:
                            carrier_name = carrier.get("name", "Unknown")
                            
                    await manager.broadcast({
                        "type": "match_suggested",
                        "score": best_score,
                        "load_details": f"{load['weight']}kg {load.get('cargoType')}, {load['pickup']} → {load['drop']}",
                        "carrier_details": f"{carrier_name} ({best_vehicle.get('vehicleNumber')})",
                        "explanation": f"Score {best_score}: good capacity match but potential deviation. Flagged for dispatcher review."
                    })
                    
                else:
                    # NO MATCH
                    await manager.broadcast({
                        "type": "no_match",
                        "score": best_score if best_score > -1 else 0,
                        "load_details": f"{load['weight']}kg {load.get('cargoType')}, {load['pickup']} → {load['drop']}",
                        "carrier_details": "No available carrier",
                        "explanation": f"Gap: No verified carrier available with sufficient matching capacity and route overlap within acceptable range. Retrying in 60 seconds."
                    })
                    
        except Exception as e:
            print(f"Error in autonomous loop: {e}")

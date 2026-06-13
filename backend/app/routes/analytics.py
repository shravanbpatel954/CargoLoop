from fastapi import APIRouter, Depends

from app.database.mongodb import get_db
from app.dependencies.auth import get_current_user
from app.services.geo import CITY_COORDS, haversine_km

router = APIRouter()


@router.get("/summary")
async def analytics_summary(_: dict = Depends(get_current_user)):
    db = get_db()
    loads = [doc async for doc in db.loads.find()]
    vehicles = [doc async for doc in db.vehicles.find()]
    matches = [doc async for doc in db.matches.find()]
    listings = [doc async for doc in db.capacity_listings.find()]
    users = [doc async for doc in db.users.find()]

    total_weight = sum(load.get("weight", 0) for load in loads)
    matched = len(matches)
    active_listings = len([l for l in listings if l.get("status") == "active"])
    verified_vehicles = len([v for v in vehicles if v.get("status") == "verified"])
    verified_carriers = len([u for u in users if u.get("role") == "carrier" and u.get("trustScore", 0) >= 80])
    
    utilization = min(100, round((matched / max(len(listings), 1)) * 100, 1))

    empty_km_saved = 0.0
    co2_saved_kg = 0.0
    revenue = matched * 4200

    for match in matches:
        load = next((l for l in loads if str(l["_id"]) == match["loadId"]), None)
        listing = next((l for l in listings if str(l["_id"]) == match.get("listingId")), None)
        if not load or not listing:
            continue

        pickup = CITY_COORDS.get(load["pickup"].lower())
        drop = CITY_COORDS.get(load["drop"].lower())
        current = CITY_COORDS.get(listing["currentLocation"].lower())

        if pickup and drop and current:
            direct = haversine_km(current, pickup) + haversine_km(pickup, drop)
            empty_return = haversine_km(drop, current)
            saved = max(0, empty_return * 0.6)
            empty_km_saved += saved
            co2_saved_kg += saved * 0.12

    trust_dist = {"platinum": 0, "gold": 0, "silver": 0, "new": 0}
    for u in users:
        if u.get("role") == "carrier":
            score = u.get("trustScore", 80)
            if score >= 90:
                trust_dist["platinum"] += 1
            elif score >= 80:
                trust_dist["gold"] += 1
            elif score >= 65:
                trust_dist["silver"] += 1
            else:
                trust_dist["new"] += 1

    return {
        "revenueGenerated": round(revenue, 0),
        "emptyKmSaved": round(empty_km_saved, 1),
        "co2SavedKg": round(co2_saved_kg, 1),
        "vehicleUtilization": utilization,
        "activeCapacityListings": active_listings,
        "verifiedVehicles": verified_vehicles,
        "verifiedCarriers": verified_carriers,
        "totalLoads": len(loads),
        "totalMatches": matched,
        "trustDistribution": trust_dist,
    }

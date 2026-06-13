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

    total_weight = sum(load.get("weight", 0) for load in loads)
    matched = len(matches)
    utilization = min(100, round((matched / max(len(vehicles), 1)) * 100, 1))

    empty_km_saved = 0.0
    co2_saved_kg = 0.0
    revenue = matched * 4200

    for match in matches:
        load = next((l for l in loads if str(l["_id"]) == match["loadId"]), None)
        vehicle = next((v for v in vehicles if str(v["_id"]) == match["vehicleId"]), None)
        if not load or not vehicle:
            continue

        pickup = CITY_COORDS.get(load["pickup"].lower())
        drop = CITY_COORDS.get(load["drop"].lower())
        current = CITY_COORDS.get(vehicle["currentLocation"].lower())

        if pickup and drop and current:
            direct = haversine_km(current, pickup) + haversine_km(pickup, drop)
            empty_return = haversine_km(drop, current)
            saved = max(0, empty_return * 0.6)
            empty_km_saved += saved
            co2_saved_kg += saved * 0.12

    return {
        "revenueGenerated": round(revenue, 0),
        "emptyKmSaved": round(empty_km_saved, 1),
        "co2SavedKg": round(co2_saved_kg, 1),
        "vehicleUtilization": utilization,
        "totalLoads": len(loads),
        "totalVehicles": len(vehicles),
        "totalMatches": matched,
        "totalCargoKg": total_weight,
    }

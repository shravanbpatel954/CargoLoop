from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException

from app.database.mongodb import get_db
from app.dependencies.auth import get_current_user, require_roles
from app.models.vehicle import Vehicle, VehicleCreate

router = APIRouter()


def _serialize(doc: dict) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc


@router.post("", response_model=Vehicle, status_code=201)
async def create_vehicle(
    payload: VehicleCreate,
    user: dict = Depends(require_roles("carrier", "admin")),
):
    db = get_db()
    doc = payload.model_dump(by_alias=True)
    doc["createdAt"] = datetime.now(timezone.utc)
    doc["createdBy"] = user["_id"]
    result = await db.vehicles.insert_one(doc)
    created = await db.vehicles.find_one({"_id": result.inserted_id})
    return _serialize(created)


@router.get("", response_model=list[Vehicle])
async def list_vehicles(user: dict = Depends(get_current_user)):
    db = get_db()
    
    query = {}
    if user["role"] == "shipper":
        query["status"] = "verified"
    elif user["role"] == "carrier":
        query["$or"] = [{"createdBy": user["_id"]}, {"status": "verified"}]

    cursor = db.vehicles.find(query).sort("createdAt", -1)
    return [_serialize(doc) async for doc in cursor]


@router.get("/{vehicle_id}", response_model=Vehicle)
async def get_vehicle(vehicle_id: str, _: dict = Depends(get_current_user)):
    db = get_db()
    if not ObjectId.is_valid(vehicle_id):
        raise HTTPException(status_code=400, detail="Invalid vehicle id")

    doc = await db.vehicles.find_one({"_id": ObjectId(vehicle_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return _serialize(doc)


@router.patch("/{vehicle_id}/verify")
async def verify_vehicle(vehicle_id: str, status: str, trust_score: float = None, _: dict = Depends(require_roles("admin"))):
    db = get_db()
    if not ObjectId.is_valid(vehicle_id):
        raise HTTPException(status_code=400, detail="Invalid vehicle id")

    updates = {"status": status}
    if trust_score is not None:
        updates["trustScore"] = trust_score

    result = await db.vehicles.update_one({"_id": ObjectId(vehicle_id)}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    return {"message": f"Vehicle {status}"}

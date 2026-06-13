from datetime import datetime, timezone
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException

from app.database.mongodb import get_db
from app.dependencies.auth import get_current_user, require_roles
from app.models.capacity_listing import CapacityListing, CapacityListingCreate

router = APIRouter()

def _serialize(doc: dict) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc

@router.post("", response_model=CapacityListing, status_code=201)
async def create_capacity_listing(
    payload: CapacityListingCreate,
    user: dict = Depends(require_roles("carrier", "admin")),
):
    db = get_db()
    
    # Validate vehicle belongs to user
    vehicle = await db.vehicles.find_one({"_id": ObjectId(payload.vehicle_id)})
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    if vehicle["createdBy"] != user["_id"] and user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to list this vehicle")
    if vehicle["status"] != "verified":
        raise HTTPException(status_code=400, detail="Cannot create listing for unverified vehicle")

    doc = payload.model_dump(by_alias=True)
    doc["createdAt"] = datetime.now(timezone.utc)
    doc["createdBy"] = user["_id"]
    result = await db.capacity_listings.insert_one(doc)
    created = await db.capacity_listings.find_one({"_id": result.inserted_id})
    return _serialize(created)

@router.get("", response_model=list[CapacityListing])
async def list_capacity_listings(user: dict = Depends(get_current_user)):
    db = get_db()
    
    query = {}
    if user["role"] == "carrier":
        query["createdBy"] = user["_id"]
    elif user["role"] == "shipper":
        query["status"] = "active"

    cursor = db.capacity_listings.find(query).sort("createdAt", -1)
    return [_serialize(doc) async for doc in cursor]

@router.get("/{listing_id}", response_model=CapacityListing)
async def get_capacity_listing(listing_id: str, _: dict = Depends(get_current_user)):
    db = get_db()
    if not ObjectId.is_valid(listing_id):
        raise HTTPException(status_code=400, detail="Invalid listing id")

    doc = await db.capacity_listings.find_one({"_id": ObjectId(listing_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Listing not found")
    return _serialize(doc)

from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.database.mongodb import get_db
from app.dependencies.auth import get_current_user
from app.models.match import Match, MatchResult
from app.services.ai_explainer import explain_match
from app.services.matching import find_best_match
from app.services.scoring import composite_score

router = APIRouter()


class GenerateMatchRequest(BaseModel):
    load_id: str = Field(alias="loadId")

    model_config = {"populate_by_name": True}


def _serialize(doc: dict) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc


@router.post("/generate", response_model=MatchResult)
async def generate_match(payload: GenerateMatchRequest, _: dict = Depends(get_current_user)):
    db = get_db()
    if not ObjectId.is_valid(payload.load_id):
        raise HTTPException(status_code=400, detail="Invalid load id")

    load = await db.loads.find_one({"_id": ObjectId(payload.load_id)})
    if not load:
        raise HTTPException(status_code=404, detail="Load not found")

    listings = [doc async for doc in db.capacity_listings.find({"status": "active"})]
    if not listings:
        raise HTTPException(status_code=400, detail="No active capacity listings available")

    vehicles = [doc async for doc in db.vehicles.find({"status": "verified"})]

    best = find_best_match(load, listings, vehicles)
    if not best:
        raise HTTPException(status_code=404, detail="No suitable capacity listing found")

    listing = next(l for l in listings if str(l["_id"]) == best["listingId"])
    vehicle = next(v for v in vehicles if str(v["_id"]) == best["vehicleId"])
    
    carrier = await db.users.find_one({"_id": vehicle.get("createdBy")}) if "createdBy" in vehicle else None
    trust_score = carrier.get("trustScore", 80) if carrier else 80
            
    prio = 0
    if load.get("urgency", "").upper() == "HIGH":
        prio += 2
    cargo = load.get("cargoType", "").lower()
    if any(k in cargo for k in ["mango", "vegetable", "fruit", "dairy", "fish", "flower", "perishable"]):
        prio += 1
    urgency_boost = 1.4 if prio > 0 else 1.0

    score, breakdown = composite_score(
        load_weight=load["weight"],
        available_capacity=listing["availableCapacityKg"],
        vehicle_destination=listing["destination"],
        load_drop=load["drop"],
        vehicle_location=listing["currentLocation"],
        load_pickup=load["pickup"],
        reliability=vehicle.get("reliability", 85),
        cargo_type=load.get("cargoType", "cargo"),
        cold_storage=vehicle.get("coldStorage", False),
        carrier_trust=trust_score,
        urgency_boost=urgency_boost
    )
    
    explanation = await explain_match(load, listing, vehicle, score, breakdown)

    match_doc = {
        "loadId": best["loadId"],
        "listingId": best["listingId"],
        "vehicleId": best["vehicleId"],
        "score": score,
        "status": "recommended",
        "breakdown": breakdown,
        "explanation": explanation,
        "createdAt": datetime.now(timezone.utc),
    }
    await db.matches.insert_one(match_doc)

    return MatchResult(
        loadId=best["loadId"],
        vehicleId=best["vehicleId"],
        vehicleNumber=vehicle["vehicleNumber"],
        score=score,
        breakdown=breakdown,
        explanation=explanation,
        carrierName=carrier.get("name", "Unknown") if carrier else "Unknown",
        carrierTrustScore=trust_score
    )


@router.get("", response_model=list[Match])
async def list_matches(_: dict = Depends(get_current_user)):
    db = get_db()
    cursor = db.matches.find().sort("createdAt", -1)
    return [_serialize(doc) async for doc in cursor]


class MatchStatusUpdate(BaseModel):
    status: str

@router.patch("/{match_id}/status")
async def update_match_status(match_id: str, payload: MatchStatusUpdate, _: dict = Depends(get_current_user)):
    db = get_db()
    if not ObjectId.is_valid(match_id):
        raise HTTPException(status_code=400, detail="Invalid match id")
    
    result = await db.matches.update_one(
        {"_id": ObjectId(match_id)},
        {"$set": {"status": payload.status}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Match not found or status already set")
        
    return {"message": f"Match status updated to {payload.status}"}

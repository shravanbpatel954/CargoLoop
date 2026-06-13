from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.database.mongodb import get_db
from app.dependencies.auth import get_current_user
from app.models.match import Match, MatchResult
from app.services.ai_explainer import explain_match
from app.services.matching import find_best_match

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

    vehicles = [doc async for doc in db.vehicles.find()]
    if not vehicles:
        raise HTTPException(status_code=400, detail="No vehicles available")

    best = find_best_match(load, vehicles)
    if not best:
        raise HTTPException(status_code=404, detail="No suitable vehicle found")

    vehicle = next(v for v in vehicles if str(v["_id"]) == best["vehicleId"])
    explanation = await explain_match(load, vehicle, best["score"], best["breakdown"])

    match_doc = {
        "loadId": best["loadId"],
        "vehicleId": best["vehicleId"],
        "score": best["score"],
        "status": "recommended",
        "breakdown": best["breakdown"],
        "explanation": explanation,
        "createdAt": datetime.now(timezone.utc),
    }
    await db.matches.insert_one(match_doc)

    return MatchResult(
        loadId=best["loadId"],
        vehicleId=best["vehicleId"],
        vehicleNumber=best["vehicleNumber"],
        score=best["score"],
        breakdown=best["breakdown"],
        explanation=explanation,
    )


@router.get("", response_model=list[Match])
async def list_matches(_: dict = Depends(get_current_user)):
    db = get_db()
    cursor = db.matches.find().sort("createdAt", -1)
    return [_serialize(doc) async for doc in cursor]

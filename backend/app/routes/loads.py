from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException

from app.database.mongodb import get_db
from app.dependencies.auth import get_current_user, require_roles
from app.models.load import Load, LoadCreate

router = APIRouter()


def _serialize(doc: dict) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc

from app.services.agentic_parser import parse_natural_language_load
from pydantic import BaseModel

class AgenticLoadRequest(BaseModel):
    prompt: str

@router.post("/agentic", response_model=Load, status_code=201)
async def create_agentic_load(
    payload: AgenticLoadRequest,
    user: dict = Depends(require_roles("shipper", "admin")),
):
    db = get_db()
    load_data = await parse_natural_language_load(payload.prompt)
    doc = load_data.model_dump(by_alias=True)
    doc["createdAt"] = datetime.now(timezone.utc)
    doc["createdBy"] = user["_id"]
    result = await db.loads.insert_one(doc)
    created = await db.loads.find_one({"_id": result.inserted_id})
    return _serialize(created)


@router.post("", response_model=Load, status_code=201)
async def create_load(
    payload: LoadCreate,
    user: dict = Depends(require_roles("shipper", "admin")),
):
    db = get_db()
    doc = payload.model_dump(by_alias=True)
    doc["createdAt"] = datetime.now(timezone.utc)
    doc["createdBy"] = user["_id"]
    result = await db.loads.insert_one(doc)
    created = await db.loads.find_one({"_id": result.inserted_id})
    return _serialize(created)


@router.get("", response_model=list[Load])
async def list_loads(_: dict = Depends(get_current_user)):
    db = get_db()
    cursor = db.loads.find().sort("createdAt", -1)
    return [_serialize(doc) async for doc in cursor]


@router.get("/{load_id}", response_model=Load)
async def get_load(load_id: str, _: dict = Depends(get_current_user)):
    db = get_db()
    if not ObjectId.is_valid(load_id):
        raise HTTPException(status_code=400, detail="Invalid load id")

    doc = await db.loads.find_one({"_id": ObjectId(load_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Load not found")
    return _serialize(doc)

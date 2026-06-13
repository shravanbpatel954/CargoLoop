from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId

from app.database.mongodb import get_db
from app.dependencies.auth import require_roles
from app.models.user import UserPublic

router = APIRouter()

def _serialize_user(doc: dict) -> UserPublic:
    return UserPublic(
        _id=str(doc["_id"]),
        name=doc["name"],
        email=doc["email"],
        role=doc["role"],
        photo=doc.get("photo"),
        createdAt=doc["createdAt"],
    )

@router.get("", response_model=list[UserPublic])
async def list_users(_: dict = Depends(require_roles("admin"))):
    db = get_db()
    cursor = db.users.find().sort("createdAt", -1)
    return [_serialize_user(doc) async for doc in cursor]

@router.patch("/{user_id}/role")
async def update_user_role(user_id: str, role: str, _: dict = Depends(require_roles("admin"))):
    db = get_db()
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user id")

    if role not in ["shipper", "carrier", "admin", "suspended"]:
        raise HTTPException(status_code=400, detail="Invalid role")

    result = await db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"role": role}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": f"User role updated to {role}"}

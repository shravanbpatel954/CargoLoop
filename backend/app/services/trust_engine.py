from bson import ObjectId
from app.database.mongodb import get_db

async def recalculate_carrier_trust(user_id: str):
    db = get_db()
    if not db:
        return

    # In a real system, we would query the matches, disputes, and delivery logs.
    # For the hackathon demo, we will simulate the calculation based on mock signals
    # or just boost the score since a match was successfully made autonomously.
    
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return
        
    current_score = user.get("trustScore", 80.0)
    
    # Simulated behavioral boost for a successful autonomous match acceptance
    new_score = min(100.0, current_score + 1.2)
    
    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"trustScore": new_score}}
    )
    
    return new_score

def get_trust_tier(score: float) -> str:
    if score >= 90:
        return "PLATINUM"
    if score >= 80:
        return "GOLD"
    if score >= 65:
        return "SILVER"
    return "NEW"

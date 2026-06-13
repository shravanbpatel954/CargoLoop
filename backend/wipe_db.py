import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

async def wipe():
    client = AsyncIOMotorClient(settings.mongodb_uri)
    db = client.cargoloop
    await db.users.drop()
    await db.vehicles.drop()
    await db.loads.drop()
    await db.matches.drop()
    print('Collections dropped successfully')

if __name__ == "__main__":
    asyncio.run(wipe())

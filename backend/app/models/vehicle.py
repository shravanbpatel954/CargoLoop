from datetime import datetime

from pydantic import BaseModel, Field


from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class VehicleCreate(BaseModel):
    vehicle_number: str = Field(alias="vehicleNumber")
    current_location: str = Field(alias="currentLocation")
    current_lat: Optional[float] = Field(default=None, alias="currentLat")
    current_lng: Optional[float] = Field(default=None, alias="currentLng")
    destination: str
    dest_lat: Optional[float] = Field(default=None, alias="destLat")
    dest_lng: Optional[float] = Field(default=None, alias="destLng")
    available_capacity: float = Field(gt=0, alias="availableCapacity")
    cold_storage: bool = Field(default=False, alias="coldStorage")
    reliability: float = Field(ge=0, le=100, default=85)
    status: str = Field(default="pending") # pending, verified, rejected
    trust_score: Optional[float] = Field(default=None, alias="trustScore")

    model_config = {"populate_by_name": True}

class Vehicle(VehicleCreate):
    id: str = Field(alias="_id")
    created_at: datetime = Field(alias="createdAt")

    model_config = {"populate_by_name": True, "by_alias": True}

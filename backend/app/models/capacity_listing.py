from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class CapacityListingCreate(BaseModel):
    vehicle_id: str = Field(alias="vehicleId")
    current_location: str = Field(alias="currentLocation")
    current_lat: Optional[float] = Field(default=None, alias="currentLat")
    current_lng: Optional[float] = Field(default=None, alias="currentLng")
    destination: str
    dest_lat: Optional[float] = Field(default=None, alias="destLat")
    dest_lng: Optional[float] = Field(default=None, alias="destLng")
    available_capacity_kg: float = Field(gt=0, alias="availableCapacityKg")
    departure_time: datetime = Field(alias="departureTime")
    status: str = Field(default="active") # active, matched, completed

    model_config = {"populate_by_name": True}

class CapacityListing(CapacityListingCreate):
    id: str = Field(alias="_id")
    created_at: datetime = Field(alias="createdAt")
    created_by: str = Field(alias="createdBy")

    model_config = {"populate_by_name": True, "by_alias": True}

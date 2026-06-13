from datetime import datetime

from pydantic import BaseModel, Field


from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class VehicleCreate(BaseModel):
    vehicle_number: str = Field(alias="vehicleNumber")
    vehicle_type: str = Field(default="Truck", alias="vehicleType")
    max_capacity_kg: float = Field(gt=0, alias="maxCapacityKg")
    cold_storage: bool = Field(default=False, alias="coldStorage")
    rc_verified: bool = Field(default=False, alias="rcVerified")
    insurance_verified: bool = Field(default=False, alias="insuranceVerified")
    status: str = Field(default="pending") # pending, verified, rejected
    verification_proof: Optional[str] = Field(default=None, alias="verificationProof")

    model_config = {"populate_by_name": True}

class Vehicle(VehicleCreate):
    id: str = Field(alias="_id")
    created_at: datetime = Field(alias="createdAt")

    model_config = {"populate_by_name": True, "by_alias": True}

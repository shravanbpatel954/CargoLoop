from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


from pydantic import BaseModel, Field
from typing import Literal, Optional
from datetime import datetime

class LoadCreate(BaseModel):
    pickup: str
    pickup_lat: Optional[float] = Field(default=None, alias="pickupLat")
    pickup_lng: Optional[float] = Field(default=None, alias="pickupLng")
    drop: str
    drop_lat: Optional[float] = Field(default=None, alias="dropLat")
    drop_lng: Optional[float] = Field(default=None, alias="dropLng")
    weight: float = Field(gt=0, description="Weight in kg")
    cargo_type: str = Field(alias="cargoType")
    urgency: Literal["Low", "Medium", "High"] = "Medium"

    model_config = {"populate_by_name": True}

class Load(LoadCreate):
    id: str = Field(alias="_id")
    created_at: datetime = Field(alias="createdAt")

    model_config = {"populate_by_name": True, "by_alias": True}

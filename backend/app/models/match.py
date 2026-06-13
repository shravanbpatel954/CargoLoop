from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class MatchCreate(BaseModel):
    load_id: str = Field(alias="loadId")
    vehicle_id: str = Field(alias="vehicleId")
    score: float = Field(ge=0, le=100)
    status: Literal["recommended", "accepted", "rejected"] = "recommended"

    model_config = {"populate_by_name": True}


class Match(MatchCreate):
    id: str = Field(alias="_id")
    created_at: datetime = Field(alias="createdAt")

    model_config = {"populate_by_name": True, "by_alias": True}


class MatchResult(BaseModel):
    load_id: str = Field(alias="loadId")
    vehicle_id: str = Field(alias="vehicleId")
    vehicle_number: str = Field(alias="vehicleNumber")
    score: float
    breakdown: dict[str, float]
    explanation: str | None = None

    model_config = {"populate_by_name": True, "by_alias": True}

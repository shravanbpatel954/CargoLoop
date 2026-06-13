from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field

UserRole = Literal["shipper", "carrier", "admin"]


class UserRegister(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    role: UserRole = "shipper"
    phone: str | None = None
    aadhaar_verified: bool = Field(default=False, alias="aadhaarVerified")
    license_verified: bool = Field(default=False, alias="licenseVerified")
    trust_score: float = Field(default=80, alias="trustScore")

    model_config = {"populate_by_name": True}


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserPublic(BaseModel):
    id: str = Field(alias="_id")
    name: str
    email: EmailStr
    role: UserRole
    phone: str | None = None
    aadhaar_verified: bool = Field(default=False, alias="aadhaarVerified")
    license_verified: bool = Field(default=False, alias="licenseVerified")
    trust_score: float = Field(default=80, alias="trustScore")
    photo: str | None = None
    created_at: datetime = Field(alias="createdAt")

    model_config = {"populate_by_name": True, "by_alias": True}


class AuthResponse(BaseModel):
    message: str
    token: str
    user: UserPublic

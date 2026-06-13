from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse

from app.config import settings
from app.database.mongodb import get_db
from app.dependencies.auth import get_current_user
from app.models.user import AuthResponse, UserLogin, UserPublic, UserRegister
from app.services.auth import (
    create_access_token,
    hash_password,
    validate_password,
    verify_password,
)
from app.services.google_oauth import (
    get_google_login_url,
    exchange_code_for_user,
    is_google_configured,
)

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


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: UserRegister):
    password_error = validate_password(payload.password)
    if password_error:
        raise HTTPException(status_code=400, detail=password_error)

    db = get_db()
    email = payload.email.lower().strip()

    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists with this email")

    doc = {
        "name": payload.name.strip(),
        "email": email,
        "password": hash_password(payload.password),
        "role": payload.role,
        "authMethods": ["email"],
        "createdAt": datetime.now(timezone.utc),
    }
    result = await db.users.insert_one(doc)
    doc["_id"] = result.inserted_id

    token = create_access_token(str(result.inserted_id))
    return AuthResponse(
        message="User registered successfully",
        token=token,
        user=_serialize_user(doc),
    )


@router.post("/login", response_model=AuthResponse)
async def login(payload: UserLogin):
    db = get_db()
    email = payload.email.lower().strip()

    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="Account does not exist")
    if not user.get("password") or not verify_password(payload.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(str(user["_id"]))
    return AuthResponse(
        message="Login successful",
        token=token,
        user=_serialize_user(user),
    )


@router.get("/google")
async def google_auth(role: str = "shipper", mode: str = "signin"):
    if not is_google_configured():
        raise HTTPException(status_code=400, detail="Google OAuth not configured")
    try:
        url = get_google_login_url(role=role, mode=mode)
    except RuntimeError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return RedirectResponse(url)


@router.get("/google/callback")
async def google_callback(code: str | None = None, state: str | None = None, error: str | None = None):
    if error or not code or not state:
        return RedirectResponse(f"{settings.frontend_url}/login?error=google_auth_failed")

    try:
        token, _user = await exchange_code_for_user(code, state)
    except ValueError as exc:
        if str(exc) == "account_not_found":
            return RedirectResponse(f"{settings.frontend_url}/signup?error=account_not_found")
        return RedirectResponse(f"{settings.frontend_url}/login?error=google_auth_failed")
    except Exception:
        return RedirectResponse(f"{settings.frontend_url}/login?error=google_auth_failed")

    return RedirectResponse(f"{settings.frontend_url}/auth/success?token={token}")


@router.get("/google/status")
async def google_status():
    return {"configured": is_google_configured()}


@router.get("/me", response_model=UserPublic)
async def profile(user: dict = Depends(get_current_user)):
    return _serialize_user(user)

import base64
import json
import secrets
from urllib.parse import urlencode

import httpx

from app.config import settings
from app.services.auth import create_access_token

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"


def is_google_configured() -> bool:
    return bool(settings.google_client_id and settings.google_client_secret)


def _callback_url() -> str:
    return f"{settings.backend_url.rstrip('/')}/auth/google/callback"


def build_state(role: str, mode: str) -> str:
    payload = {
        "nonce": secrets.token_urlsafe(16),
        "role": role if role in {"shipper", "carrier", "admin"} else "shipper",
        "mode": mode if mode in {"signin", "signup"} else "signin",
    }
    raw = json.dumps(payload).encode()
    return base64.urlsafe_b64encode(raw).decode().rstrip("=")


def parse_state(state: str) -> dict:
    padded = state + "=" * (-len(state) % 4)
    data = json.loads(base64.urlsafe_b64decode(padded.encode()))
    return {
        "role": data.get("role", "shipper"),
        "mode": data.get("mode", "signin"),
    }


def get_google_login_url(role: str = "shipper", mode: str = "signin") -> str:
    if not is_google_configured():
        raise RuntimeError("Google OAuth is not configured")

    params = {
        "client_id": settings.google_client_id,
        "redirect_uri": _callback_url(),
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "online",
        "prompt": "select_account",
        "state": build_state(role, mode),
    }
    return f"{GOOGLE_AUTH_URL}?{urlencode(params)}"


async def login_with_google(profile: dict, role: str, mode: str) -> tuple[str, dict]:
    from datetime import datetime, timezone

    from app.database.mongodb import get_db

    db = get_db()
    email = profile["email"].lower().strip()
    google_id = profile["id"]
    name = profile.get("name") or email.split("@")[0]
    photo = profile.get("picture", "")

    user = await db.users.find_one({"email": email})

    if user:
        updates: dict = {}
        if google_id and user.get("googleId") != google_id:
            updates["googleId"] = google_id
        if photo and not user.get("photo"):
            updates["photo"] = photo
        auth_methods = set(user.get("authMethods", []))
        if "google" not in auth_methods:
            auth_methods.add("google")
            updates["authMethods"] = list(auth_methods)
        if updates:
            await db.users.update_one({"_id": user["_id"]}, {"$set": updates})
            user = await db.users.find_one({"_id": user["_id"]})
    else:
        if mode == "signin":
            raise ValueError("account_not_found")

        now = datetime.now(timezone.utc)
        doc = {
            "name": name,
            "email": email,
            "role": role,
            "googleId": google_id,
            "photo": photo,
            "authMethods": ["google"],
            "createdAt": now,
        }
        result = await db.users.insert_one(doc)
        user = await db.users.find_one({"_id": result.inserted_id})

    token = create_access_token(str(user["_id"]))
    user["_id"] = str(user["_id"])
    return token, user


async def exchange_code_for_user(code: str, state: str) -> tuple[str, dict]:
    state_data = parse_state(state)
    role = state_data["role"]
    mode = state_data["mode"]

    async with httpx.AsyncClient(timeout=20.0) as client:
        token_res = await client.post(
            GOOGLE_TOKEN_URL,
            data={
                "code": code,
                "client_id": settings.google_client_id,
                "client_secret": settings.google_client_secret,
                "redirect_uri": _callback_url(),
                "grant_type": "authorization_code",
            },
        )
        token_res.raise_for_status()
        access_token = token_res.json()["access_token"]

        profile_res = await client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {access_token}"},
        )
        profile_res.raise_for_status()
        profile = profile_res.json()

    return await login_with_google(profile, role, mode)

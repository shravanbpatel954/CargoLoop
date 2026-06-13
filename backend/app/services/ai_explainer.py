import httpx

from app.config import settings


FALLBACK_TEMPLATE = """Recommended because:
• Capacity fit is {capacity_fit}
• Route overlap is {route_fit}
• {cold_chain}
• Estimated fuel savings ~{fuel_savings}%"""


async def explain_match(load: dict, listing: dict, vehicle: dict, score: float, breakdown: dict) -> str:
    if settings.gemini_api_key:
        try:
            return await _gemini_explain(load, listing, vehicle, score, breakdown)
        except Exception:
            pass

    return _fallback_explain(load, listing, vehicle, score, breakdown)


async def _gemini_explain(load: dict, listing: dict, vehicle: dict, score: float, breakdown: dict) -> str:
    prompt = f"""Explain why this vehicle is the best option for this load.
Keep it concise with 4 bullet points.

Load:
{load['weight']}kg {load.get('cargoType', 'cargo')}
{load['pickup']} → {load['drop']}
Urgency: {load.get('urgency', 'Medium')}

Vehicle & Capacity Listing:
{listing['availableCapacityKg']}kg available capacity
Cold storage: {'Yes' if vehicle.get('coldStorage') else 'No'}
Reliability {vehicle.get('reliability', 85)}%
Route: {listing['currentLocation']} → {listing['destination']}

Score: {score}
Breakdown: {breakdown}
"""

    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"gemini-2.0-flash:generateContent?key={settings.gemini_api_key}"
    )
    payload = {"contents": [{"parts": [{"text": prompt}]}]}

    async with httpx.AsyncClient(timeout=20.0) as client:
        response = await client.post(url, json=payload)
        response.raise_for_status()
        data = response.json()

    return data["candidates"][0]["content"]["parts"][0]["text"].strip()


def _fallback_explain(load: dict, listing: dict, vehicle: dict, score: float, breakdown: dict) -> str:
    capacity_fit = "excellent" if breakdown.get("capacity", 0) >= 30 else "acceptable"
    route_fit = "high" if breakdown.get("route", 0) >= 25 else "moderate"
    cold_chain = (
        "Cold-chain support available for perishables"
        if vehicle.get("coldStorage")
        else "Standard cargo handling"
    )
    fuel_savings = min(25, int(score / 5))

    return FALLBACK_TEMPLATE.format(
        capacity_fit=capacity_fit,
        route_fit=route_fit,
        cold_chain=cold_chain,
        fuel_savings=fuel_savings,
    )

"""Scoring helpers for the CargoLoop matching engine."""

from app.services.geo import CITY_COORDS, haversine_km
import random

WEIGHTS = {
    "capacity": 0.35,
    "route": 0.30,
    "reliability": 0.20,
    "distance": 0.15,
}

def capacity_score(load_weight: float, available_capacity: float) -> float:
    if available_capacity < load_weight:
        return 0.0
    utilization = load_weight / available_capacity
    if utilization >= 0.6:
        return 100.0
    if utilization >= 0.4:
        return 85.0
    return 70.0

def route_score(vehicle_destination: str, load_drop: str) -> float:
    if vehicle_destination.lower() == load_drop.lower():
        return 100.0
    return 40.0

def distance_score(vehicle_location: str, load_pickup: str, v_lat: float = None, v_lng: float = None, p_lat: float = None, p_lng: float = None) -> float:
    if v_lat is not None and v_lng is not None and p_lat is not None and p_lng is not None:
        vehicle_coords = (v_lat, v_lng)
        pickup_coords = (p_lat, p_lng)
    else:
        vehicle_coords = CITY_COORDS.get(vehicle_location.lower())
        pickup_coords = CITY_COORDS.get(load_pickup.lower())
        
    if not vehicle_coords or not pickup_coords:
        return 50.0

    km = haversine_km(vehicle_coords, pickup_coords)
    if km <= 50:
        return 100.0
    if km <= 120:
        return 80.0
    if km <= 250:
        return 60.0
    return 30.0

def cargo_compatibility(cargo_type: str, cold_storage: bool) -> float:
    perishable = cargo_type.lower() in {"perishable", "mangoes", "fruits", "dairy", "vegetables"}
    if perishable and cold_storage:
        return 100.0
    if perishable and not cold_storage:
        return 20.0
    return 90.0

def risk_score(load_pickup: str, load_drop: str) -> float:
    risk = 10.0
    if "mumbai" in load_drop.lower():
        risk += 35.0
    if "delhi" in load_pickup.lower():
        risk += 15.0
    return min(100.0, risk + random.uniform(0, 10))

def calculate_price(distance_km: float, weight_kg: float, risk: float, is_cold_chain: bool) -> float:
    base_rate_per_km_kg = 0.05
    price = distance_km * weight_kg * base_rate_per_km_kg
    if is_cold_chain:
        price *= 1.4
    risk_premium = 1.0 + (risk / 100.0) * 0.3
    return round(price * risk_premium, 2)

def composite_score(
    *,
    load_weight: float,
    available_capacity: float,
    vehicle_destination: str,
    load_drop: str,
    vehicle_location: str,
    load_pickup: str,
    reliability: float,
    cargo_type: str,
    cold_storage: bool,
    vehicle_lat: float = None,
    vehicle_lng: float = None,
    pickup_lat: float = None,
    pickup_lng: float = None,
    drop_lat: float = None,
    drop_lng: float = None
) -> tuple[float, dict[str, float]]:
    
    scores = {
        "capacity": capacity_score(load_weight, available_capacity),
        "route": route_score(vehicle_destination, load_drop),
        "distance": distance_score(vehicle_location, load_pickup, vehicle_lat, vehicle_lng, pickup_lat, pickup_lng),
        "reliability": reliability,
        "cargo": cargo_compatibility(cargo_type, cold_storage),
    }

    weighted = (
        scores["capacity"] * WEIGHTS["capacity"]
        + scores["route"] * WEIGHTS["route"]
        + scores["reliability"] * WEIGHTS["reliability"]
        + scores["distance"] * WEIGHTS["distance"]
    )

    cargo_bonus = (scores["cargo"] - 50) * 0.1
    
    risk = risk_score(load_pickup, load_drop)
    risk_penalty = risk * 0.15 
    
    final = min(100.0, max(0.0, round(weighted + cargo_bonus - risk_penalty, 1)))

    if vehicle_lat is not None and vehicle_lng is not None and drop_lat is not None and drop_lng is not None:
        dist = haversine_km((vehicle_lat, vehicle_lng), (drop_lat, drop_lng))
    else:
        v_coords = CITY_COORDS.get(vehicle_location.lower())
        d_coords = CITY_COORDS.get(load_drop.lower())
        dist = 500.0
        if v_coords and d_coords:
            dist = haversine_km(v_coords, d_coords)
        
    price = calculate_price(dist, load_weight, risk, cold_storage)

    breakdown = {
        "capacity": round(scores["capacity"] * WEIGHTS["capacity"], 1),
        "route": round(scores["route"] * WEIGHTS["route"], 1),
        "reliability": round(scores["reliability"] * WEIGHTS["reliability"], 1),
        "distance": round(scores["distance"] * WEIGHTS["distance"], 1),
        "cargoBonus": round(cargo_bonus, 1),
        "riskPenalty": round(-risk_penalty, 1),
        "riskScore": round(risk, 1),
        "dynamicPrice": price
    }
    return final, breakdown

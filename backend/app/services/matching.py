from app.services.scoring import composite_score


def find_best_match(load: dict, listings: list[dict], vehicles: list[dict]) -> dict | None:
    best: dict | None = None
    best_score = -1.0
    
    vehicle_map = {str(v["_id"]): v for v in vehicles}

    for listing in listings:
        if listing["availableCapacityKg"] < load["weight"]:
            continue

        vehicle = vehicle_map.get(listing["vehicleId"])
        if not vehicle:
            continue

        score, breakdown = composite_score(
            load_weight=load["weight"],
            available_capacity=listing["availableCapacityKg"],
            vehicle_destination=listing["destination"],
            load_drop=load["drop"],
            vehicle_location=listing["currentLocation"],
            load_pickup=load["pickup"],
            reliability=vehicle.get("reliability", 85), # Fallback if we moved reliability to user
            cargo_type=load.get("cargoType", ""),
            cold_storage=vehicle.get("coldStorage", False),
            vehicle_lat=listing.get("currentLat"),
            vehicle_lng=listing.get("currentLng"),
            pickup_lat=load.get("pickupLat"),
            pickup_lng=load.get("pickupLng"),
            drop_lat=load.get("dropLat"),
            drop_lng=load.get("dropLng")
        )

        if score > best_score:
            best_score = score
            best = {
                "loadId": str(load["_id"]),
                "listingId": str(listing["_id"]),
                "vehicleId": str(vehicle["_id"]),
                "vehicleNumber": vehicle["vehicleNumber"],
                "score": score,
                "breakdown": breakdown,
            }

    return best

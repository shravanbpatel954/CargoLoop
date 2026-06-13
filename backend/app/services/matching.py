from app.services.scoring import composite_score


def find_best_match(load: dict, vehicles: list[dict]) -> dict | None:
    best: dict | None = None
    best_score = -1.0

    for vehicle in vehicles:
        if vehicle["availableCapacity"] < load["weight"]:
            continue

        score, breakdown = composite_score(
            load_weight=load["weight"],
            available_capacity=vehicle["availableCapacity"],
            vehicle_destination=vehicle["destination"],
            load_drop=load["drop"],
            vehicle_location=vehicle["currentLocation"],
            load_pickup=load["pickup"],
            reliability=vehicle.get("reliability", 85),
            cargo_type=load.get("cargoType", ""),
            cold_storage=vehicle.get("coldStorage", False),
            vehicle_lat=vehicle.get("currentLat"),
            vehicle_lng=vehicle.get("currentLng"),
            pickup_lat=load.get("pickupLat"),
            pickup_lng=load.get("pickupLng"),
            drop_lat=load.get("dropLat"),
            drop_lng=load.get("dropLng")
        )

        if score > best_score:
            best_score = score
            best = {
                "loadId": str(load["_id"]),
                "vehicleId": str(vehicle["_id"]),
                "vehicleNumber": vehicle["vehicleNumber"],
                "score": score,
                "breakdown": breakdown,
            }

    return best

import json
import os
import google.generativeai as genai
from dotenv import load_dotenv
from app.models.load import LoadCreate

def init_gemini():
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key:
        genai.configure(api_key=api_key)

async def parse_natural_language_load(prompt: str) -> LoadCreate:
    """
    Takes a natural language prompt like "I need to move 5 tons of cold-storage mangoes from Pune to Mumbai by tomorrow"
    and returns a LoadCreate object.
    """
    init_gemini()
    
    # Using Gemini 1.5 Pro or Flash depending on availability
    # We will just use the standard model name for generic text
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        system_prompt = (
            "You are an AI logistics parsing assistant. "
            "Extract the following fields from the user's shipping request:\n"
            "- pickup: city or location (string)\n"
            "- pickupLat: estimated latitude for pickup city (float)\n"
            "- pickupLng: estimated longitude for pickup city (float)\n"
            "- drop: city or location (string)\n"
            "- dropLat: estimated latitude for drop city (float)\n"
            "- dropLng: estimated longitude for drop city (float)\n"
            "- weight: weight in kg (float). Note: 1 ton = 1000 kg.\n"
            "- cargoType: describe the cargo type (string)\n"
            "- urgency: must be strictly one of ['Low', 'Medium', 'High'] based on the prompt's implied urgency.\n"
            "\n"
            "Return ONLY a valid JSON object matching these exact keys. Do not include markdown formatting or backticks around the json."
        )
        
        response = model.generate_content(f"{system_prompt}\n\nUser Request: {prompt}")
        text = response.text.strip()
        
        # Strip any potential markdown wrappers if the model ignores the instruction
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
        
        data = json.loads(text)
        
        return LoadCreate(
            pickup=data.get("pickup", "Unknown"),
            pickupLat=data.get("pickupLat"),
            pickupLng=data.get("pickupLng"),
            drop=data.get("drop", "Unknown"),
            dropLat=data.get("dropLat"),
            dropLng=data.get("dropLng"),
            weight=float(data.get("weight", 100.0)),
            cargoType=data.get("cargoType", "General"),
            urgency=data.get("urgency", "Medium")
        )
    except Exception as e:
        print(f"Agentic parser error: {e}")
        # Fallback if Gemini is not configured or fails
        return LoadCreate(
            pickup="Auto-Detected Origin",
            drop="Auto-Detected Destination",
            weight=1000.0,
            cargoType="General Cargo",
            urgency="Medium"
        )

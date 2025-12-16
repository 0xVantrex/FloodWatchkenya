# weather/views.py
import requests
from django.http import JsonResponse

def get_weather(request):
    lat = request.GET.get('lat')
    lon = request.GET.get('lon')

    if not lat or not lon:
        return JsonResponse({"error": "Missing latitude or longitude"}, status=400)

    try:
        # Open-Meteo endpoint for current weather
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
        response = requests.get(url, timeout=10)
        data = response.json()

        if "current_weather" not in data:
            return JsonResponse({"error": "No weather data available"}, status=400)

        weather_data = {
            "temp_c": data["current_weather"].get("temperature"),
            "windspeed_kph": data["current_weather"].get("windspeed"),
            "winddirection_deg": data["current_weather"].get("winddirection"),
            "weathercode": data["current_weather"].get("weathercode"),
            "time": data["current_weather"].get("time")
        }

        return JsonResponse(weather_data)

    except requests.RequestException as e:
        return JsonResponse({"error": "Failed to fetch weather data", "details": str(e)}, status=500)

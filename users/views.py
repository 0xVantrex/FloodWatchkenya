from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from django.http import JsonResponse
import json

@csrf_exempt
def login_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=405)

    data = json.loads(request.body)
    username = data.get("username")
    password = data.get("password")

    user = authenticate(username=username, password=password)
    if user:
        token, created = Token.objects.get_or_create(user=user)
        return JsonResponse({
            "message": f"User {username} logged in successfully",
            "token": token.key
        })
    
    return JsonResponse({"error": "Invalid credentials"}, status=400)

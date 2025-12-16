from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import Location
from .serializers import UserSerializer, LocationSerializer

# ===== API ENDPOINTS =====

# User Registration
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer

# User Login
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({'error': 'Username and password required'}, status=400)
    
    user = authenticate(username=username, password=password)
    if not user:
        return Response({'error': 'Invalid credentials'}, status=400)
    
    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        'message': 'Login successful',
        'token': token.key,
        'user_id': user.id,
        'username': user.username
    })

# Location CRUD
class LocationListCreateView(generics.ListCreateAPIView):
    serializer_class = LocationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Location.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # If setting as primary, unset other primary locations
        if serializer.validated_data.get('is_primary', False):
            Location.objects.filter(user=self.request.user, is_primary=True).update(is_primary=False)
        serializer.save(user=self.request.user)

class LocationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = LocationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Location.objects.filter(user=self.request.user)

# ===== PAGE VIEWS (keep these for your Bootstrap frontend) =====
from django.shortcuts import render

def index(request):
    return render(request, "index.html")

def login_page(request):
    return render(request, "login.html")

def register_page(request):
    return render(request, "register.html")

def forgot_password(request):
    return render(request, "forgot_password.html")
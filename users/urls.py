from django.urls import path
from . import views

urlpatterns = [
    # ===== PAGES (for Bootstrap frontend) =====
    path("", views.index, name="index"),
    path("login/", views.login_page, name="login"),
    path("register/", views.register_page, name="register"),
    path("forgot-password/", views.forgot_password, name="forgot_password"),
    
    # ===== API ENDPOINTS =====
    path("api/register/", views.RegisterView.as_view(), name="api_register"),
    path("api/login/", views.login_view, name="api_login"),
    path("api/locations/", views.LocationListCreateView.as_view(), name="location-list"),
    path("api/locations/<int:pk>/", views.LocationDetailView.as_view(), name="location-detail"),
]
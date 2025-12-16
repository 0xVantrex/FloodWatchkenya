from django.urls import path
from . import views

urlpatterns = [
    # Pages
    path("", views.index, name="index"),
    path("login/", views.login_page, name="login"),
    path("register/", views.register_page, name="register"),
    path("forgot-password/", views.forgot_password, name="forgot_password"),

    # API
    path("api/login/", views.api_login, name="api_login"),
]

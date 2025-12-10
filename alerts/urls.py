from django.urls import path
from . import views

urlpatterns = [
    path('', views.list_alerts, name='list_alerts'),
    path('create/', views.create_alert, name='create_alert'),
]

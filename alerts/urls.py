# alerts/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.list_alerts, name='list_alerts'),         
    path('create/', views.create_alert, name='create_alert'),
    path('<int:pk>/', views.get_alert, name='get_alert'),    
    path('<int:pk>/update/', views.update_alert, name='update_alert'), 
    path('<int:pk>/delete/', views.delete_alert, name='delete_alert'), 
]

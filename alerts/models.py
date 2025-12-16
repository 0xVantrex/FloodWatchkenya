from django.db import models
from django.contrib.auth.models import User
from users.models import Location 

class Alert(models.Model):
    STATUS_CHOICES = [
        ("active", "Active"),
        ("expired", "Expired"),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="active")
    created_at = models.DateTimeField(auto_now_add=True)
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name="alerts",null=True,blank=True)  # <- new field

    def __str__(self):
        return self.title

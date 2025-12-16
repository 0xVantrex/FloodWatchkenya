
from django.db import models
from django.contrib.auth.models import User

class Location(models.Model):
    COUNTY_CHOICES = [
        ('NAIROBI', 'Nairobi'),
        ('MOMBASA', 'Mombasa'),
        ('KISUMU', 'Kisumu'),
        ('NAKURU', 'Nakuru'),
        
    ]  
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='locations')
    county = models.CharField(max_length=50, choices=COUNTY_CHOICES)
    subcounty = models.CharField(max_length=100)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.county}, {self.subcounty}"
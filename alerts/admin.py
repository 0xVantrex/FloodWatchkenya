from django.contrib import admin
from .models import Alert

@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'created_at', 'location')
    list_filter = ('status', 'created_at')
    search_fields = ('title', 'description')

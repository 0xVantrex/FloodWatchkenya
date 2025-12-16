# alerts/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework import status
from .models import Alert
from .serializers import AlertSerializer


# List all alerts
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def list_alerts(request):
    alerts = Alert.objects.filter(location__user=request.user)
    serializer = AlertSerializer(alerts, many=True)
    return Response(serializer.data)

# Create a new alert
@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def create_alert(request):
    serializer = AlertSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Retrieve a single alert by ID
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_alert(request, pk):
    try:
        alert = Alert.objects.get(pk=pk)
    except Alert.DoesNotExist:
        return Response({"error": "Alert not found"}, status=status.HTTP_404_NOT_FOUND)
    serializer = AlertSerializer(alert)
    return Response(serializer.data)

# Update an alert by ID
@api_view(['PUT', 'DELETE'])
@permission_classes([permissions.IsAdminUser])
def update_or_delete_alert(request, pk):
    try:
        alert = Alert.objects.get(pk=pk)
    except Alert.DoesNotExist:
        return Response({"error": "Alert not found"}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'PUT':
        serializer = AlertSerializer(alert, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method =='DELETE':
        alert.delete()
        return Response({"message": "Alert deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

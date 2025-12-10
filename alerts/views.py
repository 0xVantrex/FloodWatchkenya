from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Alert
from .serializers import AlertSerializer

@api_view(['GET'])
def list_alerts(request):
    alerts = Alert.objects.all()
    serializer = AlertSerializer(alerts, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_alert(request):
    serializer = AlertSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Alert created successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework import status
from .models import Report
from .serializers import ReportSerializer

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def list_reports(request):
    reports = Report.objects.filter(user=request.user)
    serializer = ReportSerializer(reports, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_report(request):
    data = request.data.copy()
    data['user'] = request.user.id
    
    serializer = ReportSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Report created successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

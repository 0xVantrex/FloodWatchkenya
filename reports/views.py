from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Report
from .serializers import ReportSerializer

@api_view(['GET'])
def list_reports(request):
    reports = Report.objects.all()
    serializer = ReportSerializer(reports, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_report(request):
    serializer = ReportSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Report created successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from django.urls import path
from .views import chart_data  # Import the chart_data view function

urlpatterns = [
    path('charts/', chart_data, name='chart-data'),  # Define the URL for your chart data API
]



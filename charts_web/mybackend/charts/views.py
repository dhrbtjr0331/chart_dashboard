from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .generate_data import generate_candlestick_data
from datetime import datetime, timedelta

@api_view(['GET'])
def chart_data(request):
    candlestick_data = {
        "data": generate_candlestick_data(datetime(2023, 1, 5), 20)
    }
    line_chart_data = {
        "labels": ["Jan", "Feb", "Mar", "Apr"],
        "data": [10, 20, 30, 40]
    }
    bar_chart_data = {
        "labels": ["Product A", "Product B", "Product C"],
        "data": [100, 150, 200]
    }
    pie_chart_data = {
        "labels": ["Red", "Blue", "Yellow"],
        "data": [300, 50, 100]
    }

    combined_data = {
        "candlestick_chart": candlestick_data,
        "line_chart": line_chart_data,
        "bar_chart": bar_chart_data,
        "pie_chart": pie_chart_data
    }

    return Response(combined_data)

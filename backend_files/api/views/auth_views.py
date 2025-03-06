from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from supabase import create_client
import os

# Supabase Setup
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://skzjcvdwoveuczvshzka.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "your-supabase-api-key")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

@api_view(['POST'])
def signup(request):
    """ User Registration """
    data = request.data
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'Employee')  # Default role is Employee

    # Create user in Supabase
    response = supabase.auth.sign_up({
        "email": email,
        "password": password
    })

    if "error" in response:
        return Response({"error": response["error"]["message"]}, status=status.HTTP_400_BAD_REQUEST)

    # Save user role in Supabase Database
    supabase.table("Employee").insert({"Name": data.get("name"), "Role": role, "EmployeeStatus": "Active"}).execute()

    return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def login(request):
    """ User Login """
    data = request.data
    email = data.get('email')
    password = data.get('password')

    # Authenticate user with Supabase
    response = supabase.auth.sign_in_with_password({
        "email": email,
        "password": password
    })

    if "error" in response:
        return Response({"error": response["error"]["message"]}, status=status.HTTP_400_BAD_REQUEST)

    return Response({
        "message": "Login successful!",
        "access_token": response["session"]["access_token"],
        "user": response["user"]
    }, status=status.HTTP_200_OK)

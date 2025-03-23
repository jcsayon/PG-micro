# api/views/auth_views.py

from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


@api_view(['POST'])
def signup(request):
    print("Request data:", request.data)  # Debug: print request payload
    serializer = UserSignupSerializer(data=request.data)
    if serializer.is_valid():
        try:
            user = serializer.save()
            print("User created:", user)  # Debug: confirm user creation
        except Exception as e:
            print("Error during user creation:", e)
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({
            "message": "User created successfully!",
            "user": {
                "username": getattr(user, "username", None) or getattr(user, "name", None),
                "email": user.email,
                "role": user.role
            }
        }, status=status.HTTP_201_CREATED)
    print("Serializer errors:", serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        # Your authentication logic here...
        # For example, using Django's authenticate:
        from django.contrib.auth import authenticate
        user = authenticate(username=name, password=password)
        if user:
            return Response({"message": "Login successful!", "role": user.role}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
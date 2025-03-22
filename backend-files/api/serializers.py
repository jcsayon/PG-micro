from rest_framework import serializers
from django.contrib.auth import get_user_model
from api.models import Inventory  # Make sure your Inventory model is defined in api/models.py

User = get_user_model()

class UserSignupSerializer(serializers.ModelSerializer):
    # Enforce a minimum password length and mark as write-only.
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        error_messages={"min_length": "Password must be at least 8 characters long."}
    )

    class Meta:
        model = User
        # Make sure that the fields listed here exist on your custom user model.
        # If your user model uses 'username' instead of 'name', update accordingly.
        fields = ['username', 'email', 'password', 'role']
        extra_kwargs = {
            'name': {'required': True},
            'email': {'required': True},
            'role': {'required': True},
        }

    def create(self, validated_data):
        # Remove the password from the validated data so we can hash it.
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)  # Hash the password
        user.save()
        return user

class UserLoginSerializer(serializers.Serializer):
    # The login serializer expects the user's name and password.
    # If your custom user model uses 'username' instead of 'name', adjust this.
    username = serializers.CharField(required=True)
    name = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = '__all__'  # Or specify a list of fields, e.g., ['id', 'brand', 'model', ...]
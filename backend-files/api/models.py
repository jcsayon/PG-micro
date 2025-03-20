from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # e.g., custom fields
    role = models.CharField(max_length=50, default='Employee')

    class Meta:
        db_table = 'api_user'  # or rename

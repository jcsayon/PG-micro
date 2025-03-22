# api/urls.py
from django.urls import path
from api.views.auth_views import signup, login
from api.views.inventory_list import inventory_list

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('login/', login, name='login'),
    path('inventory/', inventory_list, name='inventory_list'),
]

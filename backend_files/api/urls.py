from django.urls import path
from .views import UserListView

from .views.auth_views import signup, login
urlpatterns = [
    path("users/", UserListView.as_view(), name="users"),
    path('signup/', signup, name='signup'),
    path('login/', login, name='login'),
]

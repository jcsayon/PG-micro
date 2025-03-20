"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import path, include
from django.shortcuts import redirect
from django.contrib import admin
def root_redirect(request):
    # Suppose your React login page is at http://localhost:5173/
    # If you have a dedicated "/login" route in the frontend, 
    # you can do: "http://localhost:5173/login"
    return redirect("http://localhost:5173/")
urlpatterns = [
    path('', root_redirect, name="root_redirect"),  # Root URL -> redirect
    path('admin/', admin.site.urls),
    path('api/auth/', include('api.urls')),         # or wherever your API routes are
]


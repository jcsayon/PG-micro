from django.shortcuts import render

# Create your views here.
from django.shortcuts import redirect

def root_redirect(request):
    return redirect("http://localhost:5173")

urlpatterns = [
    path('', root_redirect, name="root_redirect"),
    path('admin/', admin.site.urls),
    path('api/auth/', include('api.urls')),
]
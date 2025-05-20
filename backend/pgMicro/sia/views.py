#LOCATION C:\Users\17738\Documents\PG-micro-ambitous\PG-micro\backend\pgMicro\sia\views.py
from rest_framework import viewsets, generics, permissions
from .models import *
from .serializers import *
from .serializers import CustomerSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status
from django.core.mail import send_mail
from django.utils.timezone import now
from django.shortcuts import redirect # <-- Add this import
from django.conf import settings     # <-- Add this import
from urllib.parse import urlencode   # <-- Add this import
import requests # <-- Add this import for making HTTP requests
import json     # <-- Add this import for handling JSON data
# Import necessary components from the Google Client Libraries
# You'll need these installed: pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from google.auth.transport.requests import Request

# 👇 VIEWSETS FOR ROUTER-REGISTERED ENDPOINTS
class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

# ------------------------
# PRODUCT CATEGORY VIEWSET
# ------------------------
class ProductCategoryViewSet(viewsets.ModelViewSet):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer
    permission_classes = [permissions.AllowAny]

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer

    @action(detail=True, methods=['put'], url_path='catalog')
    def update_catalog(self, request, pk=None):
        supplier = self.get_object()
        product_ids = request.data.get('catalog', [])
        
        if not isinstance(product_ids, list):
            return Response({"error": "Catalog must be a list of product IDs."}, status=status.HTTP_400_BAD_REQUEST)
        
        supplier.catalog.set(product_ids)
        supplier.save()
        return Response(SupplierSerializer(supplier).data, status=status.HTTP_200_OK)
    
class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

# ------------------------
# PRODUCT VIEWSET
# ------------------------
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]


class ProductWarrantyViewSet(viewsets.ModelViewSet):
    queryset = ProductWarranty.objects.all()
    serializer_class = ProductWarrantySerializer

# ------------------------
# INVENTORY VIEWSET
# ------------------------
class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer  # ✅ This must be set

class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    permission_classes = [permissions.AllowAny]

class OrdersViewSet(viewsets.ModelViewSet):
    queryset = Orders.objects.all()
    serializer_class = OrdersSerializer

class OrderItemWarrantyViewSet(viewsets.ModelViewSet):
    queryset = OrderItemWarranty.objects.all()
    serializer_class = OrderItemWarrantySerializer

class OrderItemDetailsViewSet(viewsets.ModelViewSet):
    queryset = OrderItemDetails.objects.all()
    serializer_class = OrderItemDetailsSerializer

class OrderPaymentViewSet(viewsets.ModelViewSet):
    queryset = OrderPayment.objects.all()
    serializer_class = OrderPaymentSerializer

class ReturnsViewSet(viewsets.ModelViewSet):
    queryset = Returns.objects.all()
    serializer_class = ReturnsSerializer

class RefundViewSet(viewsets.ModelViewSet):
    queryset = Refund.objects.all()
    serializer_class = RefundSerializer

class ReplacementViewSet(viewsets.ModelViewSet):
    queryset = Replacement.objects.all()
    serializer_class = ReplacementSerializer

class PurchaseOrderViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrder.objects.all()
    serializer_class = PurchaseOrderSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        previous_status = instance.status
        response = super().update(request, *args, **kwargs)

        # After saving, trigger email only if status changed to "Delivered"
        instance.refresh_from_db()
        if previous_status != "Delivered" and instance.status == "Delivered" and not instance.email_sent:
            send_po_email_to_supplier(instance)

        return response

class PurchaseOrderDetailsViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrderDetails.objects.all()
    serializer_class = PurchaseOrderDetailsSerializer

class PurchaseOrderPaymentViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrderPayment.objects.all()
    serializer_class = PurchaseOrderPaymentSerializer

class PurchaseOrderTrackingViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrderTracking.objects.all()
    serializer_class = PurchaseOrderTrackingSerializer

class ExpensesViewSet(viewsets.ModelViewSet):
    queryset = Expenses.objects.all()
    serializer_class = ExpensesSerializer

class IncomeViewSet(viewsets.ModelViewSet):
    queryset = Income.objects.all()
    serializer_class = IncomeSerializer

class ReportModuleViewSet(viewsets.ModelViewSet):
    queryset = ReportModule.objects.all()
    serializer_class = ReportModuleSerializer

# 👇 EXTRA ENDPOINT NOT IN ROUTER (for filtered inventory)
class DamagedInventoryListView(generics.ListAPIView):
    queryset = Inventory.objects.filter(stock_status="Damaged")
    serializer_class = InventorySerializer
    
from rest_framework import viewsets, permissions
from .models import DamageProduct
from .serializers import DamageProductSerializer

class DamageProductViewSet(viewsets.ModelViewSet):
    queryset = DamageProduct.objects.all()
    serializer_class = DamageProductSerializer
    permission_classes = [permissions.AllowAny]  # (or IsAuthenticated later)

def send_po_email_to_supplier(purchase_order):
    subject = f"Purchase Order #{purchase_order.id} Finalized"
    message = (
        f"To {purchase_order.supplier.name},\n\n"
        f"A new purchase order has been finalized.\n"
        f"PO ID: {purchase_order.id}\n"
        f"Date: {purchase_order.purchase_order_date.strftime('%Y-%m-%d')}\n"
        f"Total Amount: ₱{purchase_order.total_amount}\n\n"
        "Please prepare the items for delivery.\n\n"
        "Regards,\nPG Micro World"
    )
    send_mail(subject, message, settings.EMAIL_HOST_USER, [purchase_order.supplier.email])
    purchase_order.email_sent = True
    purchase_order.email_sent_date = now()
    purchase_order.save()

# Add the new views below your existing ViewSets

def google_oauth_initiate(request):
    """
    Initiates the Google OAuth 2.0 authorization flow.
    """
    # These scopes determine what data your application can access
    scopes = [
        'https://www.googleapis.com/auth/gmail.send',      # Permission to send emails
        'https://www.googleapis.com/auth/gmail.readonly',  # Permission to read emails/threads
        # Add other scopes if needed, e.g., 'https://www.googleapis.com/auth/userinfo.email'
    ]

    # Build the authorization URL
    # Use the 'offline' access type to get a refresh token
    # Use 'consent' prompt to ensure the consent screen is always shown (useful during development)
    params = {
        'client_id': settings.GOOGLE_CLIENT_ID,
        'redirect_uri': settings.GOOGLE_OAUTH_REDIRECT_URI,
        'response_type': 'code',
        'scope': ' '.join(scopes),
        'access_type': 'offline', # Request a refresh token
        'prompt': 'consent',      # Ensure consent screen is shown
    }

    auth_url = 'https://accounts.google.com/o/oauth2/v2/auth?' + urlencode(params)

    print("Generated Auth URL:", auth_url) # <-- Add this line

    # Redirect the user to Google's authorization server
    return redirect(auth_url)

# Keep the placeholder for the callback view for now
# def google_oauth_callback(request):
#     pass # Implementation goes here

# Implement the OAuth Callback View
def google_oauth_callback(request):
    """
    Handles the redirect from Google after the user grants/denies permission.
    Exchanges the authorization code for access and refresh tokens.
    """
    # Get the authorization code from the request's GET parameters
    code = request.GET.get('code')
    error = request.GET.get('error')

    # Handle the case where the user denied permission
    if error:
        print(f"OAuth error: {error}")
        # Redirect to an error page or the frontend with an error indicator
        return redirect(settings.FRONTEND_URL + '?auth_error=' + error) # Assuming you have a FRONTEND_URL setting

    if not code:
        # Should not happen if no error, but good for safety
        print("OAuth callback received without code.")
        return redirect(settings.FRONTEND_URL + '?auth_error=no_code')

    # --- Exchange the authorization code for tokens ---
    token_url = 'https://oauth2.googleapis.com/token'
    token_params = {
        'code': code,
        'client_id': settings.GOOGLE_CLIENT_ID,
        'client_secret': settings.GOOGLE_CLIENT_SECRET,
        'redirect_uri': settings.GOOGLE_OAUTH_REDIRECT_URI,
        'grant_type': 'authorization_code',
    }

    try:
        response = requests.post(token_url, data=token_params)
        response.raise_for_status() # Raise an HTTPError for bad responses (4xx or 5xx)
        tokens = response.json()

        access_token = tokens.get('access_token')
        refresh_token = tokens.get('refresh_token') # <-- This is what you need to store!
        expires_in = tokens.get('expires_in') # Access token validity in seconds
        scope = tokens.get('scope')
        token_type = tokens.get('token_type')

        # --- Securely Store the Refresh Token ---
        # You need to save the 'refresh_token' in your database, linked to
        # the system or user that will be sending/receiving emails.
        # You might have a dedicated model for this, e.g.:
        # GoogleApiCredentials.objects.create(
        #     refresh_token=refresh_token,
        #     # Link to an employee or a system user if needed
        # )
        print("Successfully obtained tokens!")
        print("Access Token (valid for ~1 hour):", access_token)
        print("Refresh Token (store securely!):", refresh_token) # Log for dev, but DON'T log in prod

        # --- Redirect back to the frontend ---
        # Redirect to your frontend application, maybe indicating success
        # Pass some indicator to the frontend that auth was successful
        return redirect(settings.FRONTEND_URL + '?auth_success=true') # Assuming you have a FRONTEND_URL setting

    except requests.exceptions.RequestException as e:
        print(f"Error exchanging code for tokens: {e}")
        # Redirect to an error page or the frontend with an error indicator
        return redirect(settings.FRONTEND_URL + '?auth_error=token_exchange_failed')
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return redirect(settings.FRONTEND_URL + '?auth_error=internal_error')


# Remember to add these new views to your sia/urls.py if you haven't already
# You added the initiate one, now uncomment or add the callback one
# path('auth/google/callback', google_oauth_callback, name='google_oauth_callback'),
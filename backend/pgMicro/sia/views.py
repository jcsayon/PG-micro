from rest_framework import viewsets, generics, permissions
from .models import *
from .serializers import *

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


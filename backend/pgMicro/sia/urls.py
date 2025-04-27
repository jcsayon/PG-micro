from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    EmployeeViewSet, CustomerViewSet, ProductCategoryViewSet,
    SupplierViewSet, AccountViewSet, ProductViewSet, ProductWarrantyViewSet,
    InventoryViewSet, OrdersViewSet, OrderItemWarrantyViewSet, OrderItemDetailsViewSet,
    OrderPaymentViewSet, ReturnsViewSet, RefundViewSet, ReplacementViewSet,
    PurchaseOrderViewSet, PurchaseOrderDetailsViewSet, PurchaseOrderPaymentViewSet,
    PurchaseOrderTrackingViewSet, ExpensesViewSet, IncomeViewSet, ReportModuleViewSet,
    DamagedInventoryListView, DamageProductViewSet  # ✅ this one is not router-registered
)

router = DefaultRouter()
router.register(r'employees', EmployeeViewSet)
router.register(r'customers', CustomerViewSet)
router.register(r'product-categories', ProductCategoryViewSet)
router.register(r'suppliers', SupplierViewSet)
router.register(r'accounts', AccountViewSet)
router.register(r'products', ProductViewSet)
router.register(r'product-warranties', ProductWarrantyViewSet)
router.register(r'inventory', InventoryViewSet)
router.register(r'orders', OrdersViewSet)
router.register(r'order-item-warranties', OrderItemWarrantyViewSet)
router.register(r'order-item-details', OrderItemDetailsViewSet)
router.register(r'order-payments', OrderPaymentViewSet)
router.register(r'returns', ReturnsViewSet)
router.register(r'refunds', RefundViewSet)
router.register(r'replacements', ReplacementViewSet)
router.register(r'purchase-orders', PurchaseOrderViewSet)
router.register(r'purchase-order-details', PurchaseOrderDetailsViewSet)
router.register(r'purchase-order-payments', PurchaseOrderPaymentViewSet)
router.register(r'purchase-order-tracking', PurchaseOrderTrackingViewSet)
router.register(r'expenses', ExpensesViewSet)
router.register(r'income', IncomeViewSet)
router.register(r'report-modules', ReportModuleViewSet)
router.register(r'damage-products', DamageProductViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('damaged-inventory/', DamagedInventoryListView.as_view(), name="damaged-inventory"),  # ✅ direct access
]

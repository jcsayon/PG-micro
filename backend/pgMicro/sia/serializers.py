from rest_framework import serializers
from .models import *

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = '__all__'

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'

class DamageProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = DamageProduct
        fields = '__all__'

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class ProductWarrantySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductWarranty
        fields = '__all__'

class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = '__all__'

class OrdersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orders
        fields = '__all__'

class OrderItemWarrantySerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItemWarranty
        fields = '__all__'

class OrderItemDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItemDetails
        fields = '__all__'

class OrderPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderPayment
        fields = '__all__'

class ReturnsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Returns
        fields = '__all__'

class RefundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Refund
        fields = '__all__'

class ReplacementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Replacement
        fields = '__all__'

class PurchaseOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrder
        fields = '__all__'

class PurchaseOrderDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrderDetails
        fields = '__all__'

class PurchaseOrderPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrderPayment
        fields = '__all__'

class PurchaseOrderTrackingSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrderTracking
        fields = '__all__'

class ExpensesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expenses
        fields = '__all__'

class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = '__all__'

class ReportModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportModule
        fields = '__all__'



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

# ------------------------
# PRODUCT CATEGORY SERIALIZER
# ------------------------
class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = '__all__'


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'

# ------------------------
# DAMAGE PRODUCT SERIALIZER
# ------------------------
class DamageProductSerializer(serializers.ModelSerializer):
    inventory_item = serializers.PrimaryKeyRelatedField(
        queryset=Inventory.objects.all()
    )

    class Meta:
        model = DamageProduct
        fields = ['id', 'inventory_item', 'damage_type', 'quantity_damaged', 'date_reported']


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'

# ------------------------
# PRODUCT SERIALIZER
# ------------------------
class ProductSerializer(serializers.ModelSerializer):
    category = ProductCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=ProductCategory.objects.all(), source='category', write_only=True
    )

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'purchase_price', 'reorder_point', 
                  'warranty_duration', 'model', 'brand', 'status', 'category', 'category_id']


class ProductWarrantySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductWarranty
        fields = '__all__'

from rest_framework import serializers
from .models import Inventory

class InventorySerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', default="Placeholder Product")
    product_category = serializers.CharField(source='product.category.name', default="Default Category")
    brand = serializers.CharField(source='product.brand', default="N/A")
    model = serializers.CharField(source='product.model', default="N/A")
    sale_status = serializers.CharField(source='product.status', default="Not Sold")

    class Meta:
        model = Inventory
        fields = [
            'id', 'serial_number', 'location', 'selling_price', 
            'quantity_received', 'quantity_available', 'stock_status', 
            'old_item', 'date_received', 'product', 'damage_product',
            'product_name', 'product_category', 'brand', 'model', 'sale_status'
        ]



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



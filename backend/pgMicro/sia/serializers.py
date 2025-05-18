from rest_framework import serializers
from .models import *
from .models import Customer

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'
        
class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'email', 'password', 'role', 'status', 'accessible_pages']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = super().create(validated_data)
        if password:
            instance.set_password(password)  # 🔒 Hash the password
            instance.save()
        return instance

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


    def validate_email(self, value):
        if Account.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already in use.")
        return value

class EmployeeSerializer(serializers.ModelSerializer):
    account = AccountSerializer(read_only=True)  # ✅ Use the class, not a string

    class Meta:
        model = Employee
        fields = '__all__'


# ------------------------
# PRODUCT CATEGORY SERIALIZER
# ------------------------
class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = '__all__'


class SupplierSerializer(serializers.ModelSerializer):
    catalog = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), many=True, required=False
    )

    class Meta:
        model = Supplier
        fields = '__all__'


# ------------------------
# DAMAGE PRODUCT SERIALIZER
# ------------------------
class DamageProductSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='inventory_item.product.name', read_only=True)
    serial_number = serializers.CharField(source='inventory_item.serial_number', read_only=True)

    class Meta:
        model = DamageProduct
        fields = [
            'id',
            'inventory_item',
            'damage_type',
            'quantity_damaged',
            'date_reported',
            'product_name',
            'serial_number',
        ]




class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'email', 'role']

    def get_employee_name(self, obj):
        return obj.employee.name if obj.employee else None
    
    def validate_email(self, value):
        if Account.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already in use.")
        return value



# ------------------------
# PRODUCT SERIALIZER
# ------------------------
class ProductSerializer(serializers.ModelSerializer):
    category = ProductCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=ProductCategory.objects.all(),
        source='category',  # still maps to `category` field
        write_only=True
    )

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'purchase_price',
            'reorder_point', 'warranty_duration', 'model',
            'brand', 'status', 'category', 'category_id'
        ]



class ProductWarrantySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductWarranty
        fields = '__all__'

from rest_framework import serializers
from .models import Inventory
class InventorySerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    brand = serializers.CharField(source='product.brand', read_only=True)
    model = serializers.CharField(source='product.model', read_only=True)

    # ✅ This line accesses the related category through the product FK
    category_name = serializers.CharField(source='product.category.name', read_only=True)
    category_id = serializers.IntegerField(source='product.category.id', read_only=True)
    description = serializers.CharField(source='product.description', read_only=True)
    purchase_price = serializers.DecimalField(source='product.purchase_price', max_digits=10, decimal_places=2, read_only=True)


    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())

    class Meta:
        model = Inventory
        fields = [
            'id', 'serial_number', 'location', 'selling_price',
            'quantity_received', 'quantity_available', 'stock_status',
            'old_item', 'date_received', 'product',
            'product_name', 'brand', 'model',
            'category_id', 'category_name',
            'description', 'purchase_price'  # ✅ include these
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



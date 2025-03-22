
# api/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Any custom fields you want, e.g.:
    name = models.CharField(max_length=150, unique=True, default="Default Name")
    role = models.CharField(max_length=50)
    def __str__(self):
        return self.username

# -----------------------
#  Employee & Account
# -----------------------
class Employee(models.Model):
    employee_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=50)
    employee_status = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.name} ({self.role})"

class Account(models.Model):
    account_id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    account_status = models.CharField(max_length=50)

    def __str__(self):
        return self.username

# -----------------------
#  Customer & Supplier
# -----------------------
class Customer(models.Model):
    customer_id = models.AutoField(primary_key=True)
    customer_name = models.CharField(max_length=255)
    customer_type = models.CharField(max_length=50)
    customer_address = models.CharField(max_length=255)
    customer_phone_number = models.CharField(max_length=50)
    customer_email = models.EmailField(unique=True)

    def __str__(self):
        return self.customer_name

class Supplier(models.Model):
    supplier_id = models.AutoField(primary_key=True)
    supplier_name = models.CharField(max_length=255)
    supplier_address = models.CharField(max_length=255)
    supplier_contact_number = models.CharField(max_length=50)
    supplier_email = models.EmailField(unique=True)

    def __str__(self):
        return self.supplier_name

# -----------------------
#  DamageProduct
# -----------------------
class DamageProduct(models.Model):
    damage_product_id = models.AutoField(primary_key=True)
    date_reported = models.DateTimeField(auto_now_add=True)
    quantity_damaged = models.IntegerField()
    damage_type = models.CharField(max_length=100)

    def __str__(self):
        return f"Damage #{self.damage_product_id}"

# -----------------------
#  ProductCategory & Product
# -----------------------
class ProductCategory(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(max_length=100)

    def __str__(self):
        return self.category_name

class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE)
    product_name = models.CharField(max_length=255)
    product_description = models.TextField()
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    reorder_point = models.IntegerField()
    warranty_duration = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    brand = models.CharField(max_length=100)
    product_status = models.CharField(max_length=50)

    def __str__(self):
        return self.product_name

# -----------------------
#  ProductWarranty
# -----------------------
class ProductWarranty(models.Model):
    product_warranty_id = models.AutoField(primary_key=True)
    warranty_start_date = models.DateTimeField()
    warranty_end_date = models.DateTimeField()
    warranty_use = models.IntegerField()

    def __str__(self):
        return f"Warranty #{self.product_warranty_id}"

# -----------------------
#  Inventory
# -----------------------
class Inventory(models.Model):
    item_id = models.AutoField(primary_key=True)
    damage_product = models.ForeignKey(DamageProduct, on_delete=models.CASCADE)
    date_received = models.DateTimeField(auto_now_add=True)
    quantity_received = models.IntegerField()
    quantity_available = models.IntegerField()
    stock_status = models.CharField(max_length=50)
    location = models.CharField(max_length=100)
    serial_number = models.CharField(max_length=100, unique=True)
    old_item = models.BooleanField(default=False)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Item #{self.item_id}"

# -----------------------
#  Orders & Return
# -----------------------
class Order(models.Model):
    order_id = models.AutoField(primary_key=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    order_date = models.DateTimeField(auto_now_add=True)
    order_status = models.CharField(max_length=50)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Order #{self.order_id}"

class Return(models.Model):
    return_id = models.AutoField(primary_key=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    return_date = models.DateTimeField(auto_now_add=True)
    reason = models.CharField(max_length=255)
    status = models.CharField(max_length=50)

    def __str__(self):
        return f"Return #{self.return_id}"

# -----------------------
#  Refund & Replacement
# -----------------------
class Refund(models.Model):
    refund_id = models.AutoField(primary_key=True)
    return_fk = models.ForeignKey(Return, on_delete=models.CASCADE)
    refund_date = models.DateTimeField(auto_now_add=True)
    refund_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    refund_method = models.CharField(max_length=50)

    def __str__(self):
        return f"Refund #{self.refund_id}"

class Replacement(models.Model):
    replacement_id = models.AutoField(primary_key=True)
    return_fk = models.ForeignKey(Return, on_delete=models.CASCADE)
    replacement_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50)
    new_item = models.BooleanField(default=False)

    def __str__(self):
        return f"Replacement #{self.replacement_id}"

# -----------------------
#  OrderItemWarranty & OrderItemDetails
# -----------------------
class OrderItemWarranty(models.Model):
    order_item_warranty_id = models.AutoField(primary_key=True)
    warranty_start_date = models.DateTimeField()
    warranty_end_date = models.DateTimeField()
    warranty_use = models.IntegerField()

    def __str__(self):
        return f"OrderItemWarranty #{self.order_item_warranty_id}"

class OrderItemDetails(models.Model):
    order_item_detail_id = models.AutoField(primary_key=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    item = models.ForeignKey(Inventory, on_delete=models.CASCADE)
    order_item_warranty = models.ForeignKey(OrderItemWarranty, on_delete=models.SET_NULL, null=True)
    quantity = models.IntegerField()

    def __str__(self):
        return f"OrderItemDetail #{self.order_item_detail_id}"

# -----------------------
#  OrderPayment
# -----------------------
class OrderPayment(models.Model):
    order_payment_id = models.AutoField(primary_key=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    payment_date = models.DateTimeField(auto_now_add=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50)

    def __str__(self):
        return f"OrderPayment #{self.order_payment_id}"

# -----------------------
#  PurchaseOrder & Related
# -----------------------
class PurchaseOrder(models.Model):
    purchase_order_id = models.AutoField(primary_key=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    purchase_order_date = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    purchase_order_status = models.CharField(max_length=50)
    expected_delivery_date = models.DateTimeField()

    def __str__(self):
        return f"PurchaseOrder #{self.purchase_order_id}"

class PurchaseOrderDetails(models.Model):
    po_details_id = models.AutoField(primary_key=True)
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    product_warranty = models.ForeignKey(ProductWarranty, on_delete=models.SET_NULL, null=True)
    buying_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField()
    status = models.BooleanField(default=True)

    def __str__(self):
        return f"PurchaseOrderDetail #{self.po_details_id}"

class PurchaseOrderPayment(models.Model):
    purchase_order_payment_id = models.AutoField(primary_key=True)
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE)
    payment_date = models.DateTimeField(auto_now_add=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50)

    def __str__(self):
        return f"PurchaseOrderPayment #{self.purchase_order_payment_id}"

class PurchaseOrderTracking(models.Model):
    tracking_id = models.AutoField(primary_key=True)
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE)
    status_update = models.CharField(max_length=100)
    update_date = models.DateTimeField(auto_now_add=True)
    location = models.CharField(max_length=100)

    def __str__(self):
        return f"Tracking #{self.tracking_id}"

# -----------------------
#  Expenses, Income, ReportModule
# -----------------------
class Expenses(models.Model):
    expense_id = models.AutoField(primary_key=True)
    purchase_order_payment = models.ForeignKey(PurchaseOrderPayment, on_delete=models.CASCADE)
    expense_date = models.DateTimeField(auto_now_add=True)
    expense_type = models.CharField(max_length=100)
    expense_amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Expense #{self.expense_id}"

class Income(models.Model):
    income_id = models.AutoField(primary_key=True)
    order_payment = models.ForeignKey(OrderPayment, on_delete=models.CASCADE)
    income_amount = models.DecimalField(max_digits=10, decimal_places=2)
    net_income = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50)
    payment_method = models.CharField(max_length=50)
    date_received = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Income #{self.income_id}"

class ReportModule(models.Model):
    report_id = models.AutoField(primary_key=True)
    income = models.ForeignKey(Income, on_delete=models.CASCADE)
    expense = models.ForeignKey(Expenses, on_delete=models.CASCADE)
    date_generated = models.DateTimeField(auto_now_add=True)
    total_income = models.DecimalField(max_digits=10, decimal_places=2)
    total_expenses = models.DecimalField(max_digits=10, decimal_places=2)
    net_profit = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50)

    def __str__(self):
        return f"Report #{self.report_id}"


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Brand(models.Model):
    name = models.CharField(max_length=100)
    category = models.ForeignKey(Category, related_name='brands', on_delete=models.CASCADE)

    def __str__(self):
        return self.name
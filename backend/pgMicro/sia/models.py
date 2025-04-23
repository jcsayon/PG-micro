from django.db import models


class Employee(models.Model):
    name = models.TextField()
    role = models.TextField()
    employee_status = models.TextField()


class Customer(models.Model):
    name = models.TextField()
    customer_type = models.TextField()
    address = models.TextField()
    phone_number = models.BigIntegerField()
    email = models.TextField(unique=True)


class ProductCategory(models.Model):
    name = models.TextField()


class Supplier(models.Model):
    name = models.TextField()
    address = models.TextField()
    contact_number = models.TextField()
    email = models.TextField(unique=True)


class DamageProduct(models.Model):
    date_reported = models.DateTimeField(auto_now_add=True)
    quantity_damaged = models.IntegerField()
    damage_type = models.TextField()


class Account(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    username = models.TextField(unique=True)
    password = models.TextField()
    email = models.TextField(unique=True)
    account_status = models.TextField()


class Product(models.Model):
    category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE)
    name = models.TextField()
    description = models.TextField()
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    reorder_point = models.IntegerField()
    warranty_duration = models.TextField()
    model = models.TextField()
    brand = models.TextField()
    status = models.TextField()


class ProductWarranty(models.Model):
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    warranty_use = models.IntegerField()


class Inventory(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)  # ✅ add this line
    damage_product = models.ForeignKey(DamageProduct, on_delete=models.CASCADE)
    date_received = models.DateTimeField(auto_now_add=True)
    quantity_received = models.IntegerField()
    quantity_available = models.IntegerField()
    stock_status = models.TextField()
    location = models.TextField()
    serial_number = models.TextField(unique=True)
    old_item = models.BooleanField()
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)



class Orders(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    order_date = models.DateTimeField(auto_now_add=True)
    order_status = models.TextField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)


class OrderItemWarranty(models.Model):
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    warranty_use = models.IntegerField()


class OrderItemDetails(models.Model):
    order = models.ForeignKey(Orders, on_delete=models.CASCADE)
    item = models.ForeignKey(Inventory, on_delete=models.CASCADE)
    warranty = models.ForeignKey(OrderItemWarranty, on_delete=models.CASCADE)
    quantity = models.IntegerField()


class OrderPayment(models.Model):
    order = models.ForeignKey(Orders, on_delete=models.CASCADE)
    payment_date = models.DateTimeField(auto_now_add=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.TextField()


class Returns(models.Model):
    order = models.ForeignKey(Orders, on_delete=models.CASCADE)
    return_date = models.DateTimeField(auto_now_add=True)
    reason = models.TextField()
    status = models.TextField()


class Refund(models.Model):
    return_order = models.ForeignKey(Returns, on_delete=models.CASCADE)
    refund_date = models.DateTimeField(auto_now_add=True)
    refund_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    refund_method = models.TextField()


class Replacement(models.Model):
    return_order = models.ForeignKey(Returns, on_delete=models.CASCADE)
    replacement_date = models.DateTimeField(auto_now_add=True)
    status = models.TextField()
    new_item = models.BooleanField()


class PurchaseOrder(models.Model):
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    purchase_order_date = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.TextField()
    expected_delivery_date = models.DateTimeField()


class PurchaseOrderDetails(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    product_warranty = models.ForeignKey(ProductWarranty, on_delete=models.CASCADE)
    buying_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField()
    status = models.BooleanField()


class PurchaseOrderPayment(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE)
    payment_date = models.DateTimeField(auto_now_add=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.TextField()


class PurchaseOrderTracking(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE)
    status_update = models.TextField()
    update_date = models.DateTimeField(auto_now_add=True)
    location = models.TextField()


class Expenses(models.Model):
    purchase_order_payment = models.ForeignKey(PurchaseOrderPayment, on_delete=models.CASCADE)
    expense_date = models.DateTimeField(auto_now_add=True)
    expense_type = models.TextField()
    expense_amount = models.DecimalField(max_digits=10, decimal_places=2)


class Income(models.Model):
    order_payment = models.ForeignKey(OrderPayment, on_delete=models.CASCADE)
    income_amount = models.DecimalField(max_digits=10, decimal_places=2)
    net_income = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.TextField()
    payment_method = models.TextField()
    date_received = models.DateTimeField(auto_now_add=True)


class ReportModule(models.Model):
    income = models.ForeignKey(Income, on_delete=models.CASCADE)
    expense = models.ForeignKey(Expenses, on_delete=models.CASCADE)
    date_generated = models.DateTimeField(auto_now_add=True)
    total_income = models.DecimalField(max_digits=10, decimal_places=2)
    total_expenses = models.DecimalField(max_digits=10, decimal_places=2)
    net_profit = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.TextField()


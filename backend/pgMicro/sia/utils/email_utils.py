from django.core.mail import send_mail
from django.conf import settings

def send_po_email(supplier_email, po_number, items, total, date, employee):
    subject = f"New Purchase Order {po_number} from PG Micro"
    item_lines = "\n".join([
        f"{item['brand']} {item['model']} x {item['quantity']}"
        for item in items
    ])
    message = (
        f"Hello,\n\nYou have received a new purchase order from PG Micro.\n\n"
        f"PO Number: {po_number}\nDate: {date}\nEmployee: {employee}\n"
        f"Total: ₱{total:,.2f}\n\nItems:\n{item_lines}\n\n"
        "Please confirm receipt.\n\nThank you."
    )
    send_mail(subject, message, settings.EMAIL_HOST_USER, [supplier_email])

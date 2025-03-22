from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.models import Inventory
from api.serializers import InventorySerializer



@api_view(['GET'])
def inventory_list(request):
    inventory_items = Inventory.objects.all()
    serializer = InventorySerializer(inventory_items, many=True)
    return Response(serializer.data)

from django.shortcuts import render
from rest_framework import viewsets
from django.http import JsonResponse

from smartcart.models import Items, Advertisements
from .serializers import ItemsSerializer, AdvertisementsSerializer


class ItemsView(viewsets.ModelViewSet):
    queryset = Items.objects.all()
    serializer_class = ItemsSerializer


class AdvertisementsView(viewsets.ModelViewSet):
    queryset = Advertisements.objects.all()
    serializer_class = AdvertisementsSerializer


# Create your views here.
def index(request):
    lays = "Bread"
    item = Items.objects.all()
    adv = Advertisements.objects.all()
    val = Items.objects.filter(item_name=lays)
    print(val[0].item_code)
    args = {'item': item, 'adv': adv}
    return render(request, "index.html", args)


def additem(request):
    val = request.GET()
    item = Items.objects.filter(item_name=val)
    item_name = item[0].item_name
    quant = item[0].Quantity
    price = item[0].Price
    img = item[0].Image
    direct_x = item[0].Direction_x
    direct_y = item[0].Direction_y
    categ = item[0].Category
    rat = item[0].Ratings
    return JSONResponse({item_name: 'item_name', quant: 'quant', price: 'price', img: 'img',
                         direct_x: 'direct_x', direct_y: 'direct_y', categ: 'categ',
                         rat: 'rat'})

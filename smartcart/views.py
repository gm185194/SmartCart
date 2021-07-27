from django.shortcuts import render
from rest_framework import viewsets
from django.http import JsonResponse
from pymongo import MongoClient

from smartcart.models import Items, Advertisements
from .serializers import ItemsSerializer, AdvertisementsSerializer

con = MongoClient('mongodb+srv://smartcartuser:youknowit@smartcart.qxw37.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
db=con['smartcartdb']

class ItemsView(viewsets.ModelViewSet):
    queryset = Items.objects.all()
    serializer_class = ItemsSerializer


class AdvertisementsView(viewsets.ModelViewSet):
    queryset = Advertisements.objects.all()
    serializer_class = AdvertisementsSerializer


# Create your views here.
def index(request):
    items = db['items'].find()
    adv = Advertisements.objects.all()
    args = {'item': items, 'adv': adv}

    return render(request, "index.html", args)

def additem(request):
    val = request.GET["transcript"]
    print(val)
    try:
        item = Items.objects.filter(item_name__icontains=val.split()[1])
        if len(item)==0:raise Exception
        item_name = item[0].item_name
        quant = item[0].Quantity
        price = item[0].Price
        img = item[0].Image.url
        if quant==0:
            if len(item) == 0: raise Exception
        return JsonResponse({"status":"found",'item_name':item_name,'price':price, 'img': img})
    except Exception as e:
        print(e)
        return JsonResponse({"status":"not found",'item_name':val})


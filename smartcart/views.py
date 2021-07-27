from django.shortcuts import render
from rest_framework import viewsets
from django.http import JsonResponse
from pymongo import MongoClient
import difflib

from smartcart.models import Items, Advertisements
from .serializers import ItemsSerializer, AdvertisementsSerializer

con = MongoClient('mongodb+srv://smartcartuser:youknowit@smartcart.qxw37.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
db=con['smartcartdb']
item_names=[i["Name"] for i in db['items'].find() ]

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
    try:
        item=difflib.get_close_matches(val[4:],item_names)
        print(item[0])
        item=db['items'].find_one({"Name":item[0]})
        item["_id"]="****"
        return JsonResponse({"status":"found","item":item})
    except Exception as e:
        print(e)
        return JsonResponse({"status":"not found",'item_name':val[4:]})


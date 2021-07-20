from django.shortcuts import render
from smartcart.models import Items, Advertisements
from rest_framework import viewsets
from .serializers import ItemsSerializer, AdvertisementsSerializer


class ItemsView(viewsets.ModelViewSet):
    queryset = Items.objects.all()
    serializer_class = ItemsSerializer


class AdvertisementsView(viewsets.ModelViewSet):
    queryset = Advertisements.objects.all()
    serializer_class = AdvertisementsSerializer


# Create your views here.
def index(request):
    item = Items.objects.all()
    adv = Advertisements.objects.all()
    args = {'item': item,'adv': adv}
    return render(request, "index.html", args)

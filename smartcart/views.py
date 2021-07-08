from django.shortcuts import render
from smartcart.models import Items

# Create your views here.
def index(request):
    item = Items.objects.all()
    args = {'item':item}
    return render(request, "index.html",args)

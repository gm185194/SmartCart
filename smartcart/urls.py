from django.contrib import admin
from django.urls import path
from django.conf.urls import url, include
from django.conf import settings
from django.conf.urls.static import static
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register('Items', views.ItemsView)
router.register('Advertisements', views.AdvertisementsView)

urlpatterns = [
    path('', views.index, name="index"),
    path('', views.additem, name="additem"),
    path('router', include(router.urls))
]

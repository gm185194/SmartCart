from rest_framework import serializers
from .models import Items, Advertisements


class ItemsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Items
        fields = (
            'url', 'item_code', 'item_name', 'Quantity', 'Price', 'Image', 'Direction_x', 'Direction_y', 'Category',
            'Ratings')


class AdvertisementsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Advertisements
        fields = (
            'url', 'Adv_Name', 'Image'
        )

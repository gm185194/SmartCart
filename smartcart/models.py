from django.db import models

# Create your models here.
category_choice = (
    ("1", "Cold Drink"),
    ("2", "Chips"),
    ("3", "Burger"),
    ("4", "Milk"),
    ("5", "Vegetables"),
)
item_ratings = (
    ("1", "Not Liked"),
    ("2", "Better"),
    ("3", "Good"),
    ("4", "Very Good"),
    ("5", "Outstanding"),
)


class Items(models.Model):
    item_code = models.CharField(max_length=300)
    item_name = models.CharField(max_length=300)
    Quantity = models.CharField(max_length=300)
    Price = models.FloatField(default=0)
    Image = models.ImageField(blank=True, null=True, upload_to="img/")
    Direction_x = models.IntegerField(blank=True, null=True)
    Direction_y = models.IntegerField(blank=True, null=True)
    Category = models.CharField(
        max_length=20,
        choices=category_choice,
        default='1'
    )
    Ratings = models.CharField(
        max_length=20,
        choices=item_ratings,
        default='1'
    )
    discount = models.FloatField(default=0)

    @property
    def Discount(self):
        return self.Price-((self.discount / 100) * self.Price)

    def __str__(self):
        return self.item_name


class Advertisements(models.Model):
    Adv_Name = models.CharField(max_length=300,blank=True)
    Image = models.ImageField(blank=True, null=True, upload_to="img/")

    def __str__(self):
        return self.Adv_Name

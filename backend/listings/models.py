from django.db import models

class Listing(models.Model):
    title = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    address = models.TextField()
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    image_urls = models.JSONField()  # stores a list of image URLs
    ratings = models.DecimalField(max_digits=3, decimal_places=2)
    description = models.TextField()
    number_of_reviews = models.IntegerField()
    amenities = models.JSONField()  # stores a list of amenities
    host_info = models.JSONField()  # stores host details
    property_type = models.CharField(max_length=255)

    def __str__(self):
        return self.title

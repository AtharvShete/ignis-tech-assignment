from django.db import models

class Listing(models.Model):
    title = models.CharField(max_length=255)
    property_type = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    address = models.TextField()
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10)
    cleaning_fee = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    service_fee = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    image_urls = models.JSONField()  # stores a list of image URLs
    ratings = models.DecimalField(max_digits=3, decimal_places=2)
    description = models.TextField()
    reviews = models.JSONField(null=True, blank=True)  # stores review objects
    number_of_reviews = models.IntegerField()
    review_tags = models.JSONField(null=True, blank=True)  # stores review tag objects
    amenities = models.JSONField()  # stores a list of amenities
    total_amenities_count = models.IntegerField(null=True, blank=True)
    amenities_metadata = models.JSONField(null=True, blank=True)
    host = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.title

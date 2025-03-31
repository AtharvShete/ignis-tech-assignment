from rest_framework import serializers
from .models import Listing
from decimal import Decimal

class ListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = '__all__'
    
    def validate_price_per_night(self, value):
        if value is None:
            return Decimal('0')
        return value
    
    def validate_currency(self, value):
        if not value:
            return 'USD'
        return value
    
    def validate_total_price(self, value):
        if value is None:
            return Decimal('0')
        return value
    
    def validate(self, data):
        # Ensure JSON fields are not None
        if 'image_urls' in data and data['image_urls'] is None:
            data['image_urls'] = []
        if 'amenities' in data and data['amenities'] is None:
            data['amenities'] = []
        return data

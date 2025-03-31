from django.contrib import admin
from .models import Listing

@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ('title', 'property_type', 'location', 'price_per_night', 'ratings')
    search_fields = ('title', 'location', 'description')
    list_filter = ('property_type',)

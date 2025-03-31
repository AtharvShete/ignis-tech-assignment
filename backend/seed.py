import os
import django
import json
from decimal import Decimal

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# Now import models after Django is configured
from listings.models import Listing

# Load JSON file
with open("airbnb_rooms.json", "r", encoding="utf-8") as file:
    data = json.load(file)

# Convert fields that should be Decimal and handle missing values
for item in data:
    # Handle required numeric fields
    try:
        item["price_per_night"] = Decimal(item["price_per_night"]) if item.get("price_per_night") else Decimal('0')
    except (TypeError, ValueError):
        item["price_per_night"] = Decimal('0')
        
    try:
        item["cleaning_fee"] = Decimal(item["cleaning_fee"]) if item.get("cleaning_fee") else None
    except (TypeError, ValueError):
        item["cleaning_fee"] = None
        
    try:
        item["service_fee"] = Decimal(item["service_fee"]) if item.get("service_fee") else None
    except (TypeError, ValueError):
        item["service_fee"] = None
        
    try:
        item["total_price"] = Decimal(item["total_price"]) if item.get("total_price") else Decimal('0')
    except (TypeError, ValueError):
        item["total_price"] = Decimal('0')
        
    try:
        item["ratings"] = Decimal(item["ratings"]) if item.get("ratings") else None
    except (TypeError, ValueError):
        item["ratings"] = None
    
    # Ensure currency is not empty
    if not item.get("currency"):
        item["currency"] = "USD"
    
    # Ensure JSON fields are not None
    if item.get("image_urls") is None:
        item["image_urls"] = []
    if item.get("amenities") is None:
        item["amenities"] = []
    if item.get("number_of_reviews") is None:
        item["number_of_reviews"] = 0

# Bulk create listings
listings = [Listing(**item) for item in data]
Listing.objects.bulk_create(listings, ignore_conflicts=True)
print(f"Successfully imported {len(listings)} listings")

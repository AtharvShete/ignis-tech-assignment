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

# Convert fields that should be Decimal
for item in data:
    item["price_per_night"] = Decimal(item["price_per_night"]) if item["price_per_night"] else None
    item["cleaning_fee"] = Decimal(item["cleaning_fee"]) if item.get("cleaning_fee") else None
    item["service_fee"] = Decimal(item["service_fee"]) if item.get("service_fee") else None
    item["total_price"] = Decimal(item["total_price"]) if item["total_price"] else None
    item["ratings"] = Decimal(item["ratings"]) if item["ratings"] else None

# Bulk create listings
listings = [Listing(**item) for item in data]
Listing.objects.bulk_create(listings, ignore_conflicts=True)
print(f"Successfully imported {len(listings)} listings")

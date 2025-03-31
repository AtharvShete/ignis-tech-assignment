# listings/views.py
from rest_framework import status, views, generics
from rest_framework.response import Response
from .models import Listing
from .serializers import ListingSerializer

class ListingListView(generics.ListAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer

class ListingCreateView(generics.CreateAPIView):
    serializer_class = ListingSerializer

# Add additional views for single item operations
class ListingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer

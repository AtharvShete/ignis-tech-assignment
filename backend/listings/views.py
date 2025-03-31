from rest_framework import generics
from django.db.models import Q
from .models import Listing
from .serializers import ListingSerializer

class ListingListView(generics.ListAPIView):
    serializer_class = ListingSerializer
    
    def get_queryset(self):
        queryset = Listing.objects.all()
        location = self.request.query_params.get('location', None)
        
        if location:
            queryset = queryset.filter(location__icontains=location)
            
        return queryset

class ListingCreateView(generics.CreateAPIView):
    serializer_class = ListingSerializer

# Add additional views for single item operations
class ListingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer

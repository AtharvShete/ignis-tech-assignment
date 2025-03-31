from django.urls import path
from . import views

urlpatterns = [
    path('listings/', views.ListingListView.as_view(), name='listing-list'),
    path('add_listing/', views.ListingCreateView.as_view(), name='add-listing'),
]

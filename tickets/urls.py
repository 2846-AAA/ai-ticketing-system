"""
URL configuration for tickets app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, CommentViewSet, TicketHistoryViewSet, UserViewSet

router = DefaultRouter()
router.register(r'tickets', TicketViewSet, basename='ticket')
router.register(r'comments', CommentViewSet, basename='comment')
router.register(r'history', TicketHistoryViewSet, basename='history')
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
]

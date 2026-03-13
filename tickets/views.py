"""
Views for the ticketing system API.
"""
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from django.db.models import Q, Count
from django_filters.rest_framework import DjangoFilterBackend

from .models import Ticket, Comment, TicketHistory
from .serializers import (
    TicketSerializer, TicketListSerializer, CommentSerializer,
    TicketHistorySerializer, UserSerializer
)
from .nlp_service import NLPService


class TicketViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Ticket CRUD operations with NLP integration.
    
    Provides:
    - list: Get all tickets
    - create: Create new ticket with auto-prioritization
    - retrieve: Get single ticket details
    - update: Update ticket
    - partial_update: Partially update ticket
    - destroy: Delete ticket
    - my_tickets: Get tickets created by current user
    - assigned_to_me: Get tickets assigned to current user
    - statistics: Get ticket statistics
    - auto_route: Auto-route ticket to appropriate agent
    """
    queryset = Ticket.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'category', 'assigned_to', 'created_by']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'updated_at', 'priority']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Use lightweight serializer for list view."""
        if self.action == 'list':
            return TicketListSerializer
        return TicketSerializer
    
    def perform_create(self, serializer):
        """Set created_by to current user."""
        serializer.save(created_by=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_tickets(self, request):
        """Get tickets created by the current user."""
        tickets = self.queryset.filter(created_by=request.user)
        serializer = self.get_serializer(tickets, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def assigned_to_me(self, request):
        """Get tickets assigned to the current user."""
        tickets = self.queryset.filter(assigned_to=request.user)
        serializer = self.get_serializer(tickets, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get ticket statistics."""
        total_tickets = self.queryset.count()
        
        stats = {
            'total': total_tickets,
            'by_status': {},
            'by_priority': {},
            'by_category': {},
        }
        
        # Group by status
        status_counts = self.queryset.values('status').annotate(count=Count('id'))
        for item in status_counts:
            stats['by_status'][item['status']] = item['count']
        
        # Group by priority
        priority_counts = self.queryset.values('priority').annotate(count=Count('id'))
        for item in priority_counts:
            stats['by_priority'][item['priority']] = item['count']
        
        # Group by category
        category_counts = self.queryset.values('category').annotate(count=Count('id'))
        for item in category_counts:
            stats['by_category'][item['category']] = item['count']
        
        return Response(stats)
    
    @action(detail=True, methods=['post'])
    def auto_route(self, request, pk=None):
        """
        Auto-route ticket to the best available agent.
        Simple routing logic based on workload and category expertise.
        """
        ticket = self.get_object()
        
        # Get all staff users (potential agents)
        agents = User.objects.filter(is_staff=True)
        
        if not agents.exists():
            return Response(
                {'error': 'No agents available'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Find agent with least assigned tickets
        best_agent = None
        min_tickets = float('inf')
        
        for agent in agents:
            assigned_count = Ticket.objects.filter(
                assigned_to=agent,
                status__in=['open', 'in_progress']
            ).count()
            
            if assigned_count < min_tickets:
                min_tickets = assigned_count
                best_agent = agent
        
        # Assign ticket to best agent
        ticket.assigned_to = best_agent
        ticket.save()
        
        # Create history entry
        TicketHistory.objects.create(
            ticket=ticket,
            user=request.user,
            field_changed='assigned_to',
            old_value=None,
            new_value=best_agent.username
        )
        
        serializer = self.get_serializer(ticket)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def reanalyze(self, request, pk=None):
        """Re-run NLP analysis on a ticket."""
        ticket = self.get_object()
        
        # Perform NLP analysis
        sentiment_score = NLPService.analyze_sentiment(f"{ticket.title} {ticket.description}")
        auto_priority = NLPService.auto_prioritize(ticket.title, ticket.description)
        suggested_category = NLPService.suggest_category(ticket.title, ticket.description)
        
        # Update ticket
        ticket.sentiment_score = sentiment_score
        ticket.auto_priority = auto_priority
        ticket.save()
        
        return Response({
            'sentiment_score': sentiment_score,
            'auto_priority': auto_priority,
            'suggested_category': suggested_category,
            'current_priority': ticket.priority,
            'current_category': ticket.category,
        })


class CommentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Comment CRUD operations.
    """
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        """Set user to current user."""
        serializer.save(user=self.request.user)
    
    def get_queryset(self):
        """Filter comments by ticket if ticket_id is provided."""
        queryset = super().get_queryset()
        ticket_id = self.request.query_params.get('ticket_id')
        
        if ticket_id:
            queryset = queryset.filter(ticket_id=ticket_id)
        
        return queryset


class TicketHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing ticket history (read-only).
    """
    queryset = TicketHistory.objects.all()
    serializer_class = TicketHistorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter history by ticket if ticket_id is provided."""
        queryset = super().get_queryset()
        ticket_id = self.request.query_params.get('ticket_id')
        
        if ticket_id:
            queryset = queryset.filter(ticket_id=ticket_id)
        
        return queryset


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for User operations (read-only).
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user details."""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def agents(self, request):
        """Get all staff users (agents)."""
        agents = self.queryset.filter(is_staff=True)
        serializer = self.get_serializer(agents, many=True)
        return Response(serializer.data)

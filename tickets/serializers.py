"""
Serializers for the ticketing system API.
"""
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Ticket, Comment, TicketHistory
from .nlp_service import NLPService


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class CommentSerializer(serializers.ModelSerializer):
    """Serializer for Comment model."""
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = Comment
        fields = ['id', 'ticket', 'user', 'user_id', 'content', 'created_at']
        read_only_fields = ['id', 'created_at']


class TicketHistorySerializer(serializers.ModelSerializer):
    """Serializer for TicketHistory model."""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = TicketHistory
        fields = ['id', 'ticket', 'user', 'field_changed', 'old_value', 'new_value', 'changed_at']
        read_only_fields = ['id', 'changed_at']


class TicketSerializer(serializers.ModelSerializer):
    """Serializer for Ticket model with NLP integration."""
    created_by = UserSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    created_by_id = serializers.IntegerField(write_only=True, required=False)
    assigned_to_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    comments = CommentSerializer(many=True, read_only=True)
    comment_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Ticket
        fields = [
            'id', 'title', 'description', 'priority', 'status', 'category',
            'sentiment_score', 'auto_priority', 'created_by', 'assigned_to',
            'created_by_id', 'assigned_to_id', 'created_at', 'updated_at',
            'resolved_at', 'comments', 'comment_count'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'resolved_at', 'sentiment_score', 'auto_priority']
    
    def get_comment_count(self, obj):
        """Get the number of comments on this ticket."""
        return obj.comments.count()
    
    def create(self, validated_data):
        """Create ticket with NLP analysis."""
        title = validated_data.get('title', '')
        description = validated_data.get('description', '')
        
        # Perform NLP analysis
        sentiment_score = NLPService.analyze_sentiment(f"{title} {description}")
        auto_priority = NLPService.auto_prioritize(title, description)
        
        # Auto-suggest category if not provided
        if 'category' not in validated_data or not validated_data['category']:
            validated_data['category'] = NLPService.suggest_category(title, description)
        
        # Add NLP results to validated data
        validated_data['sentiment_score'] = sentiment_score
        validated_data['auto_priority'] = auto_priority
        
        # If no priority is set, use auto_priority
        if 'priority' not in validated_data or not validated_data['priority']:
            validated_data['priority'] = auto_priority
        
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        """Update ticket and track changes."""
        # Track field changes for history
        request = self.context.get('request')
        user = request.user if request else None
        
        for field in ['status', 'priority', 'assigned_to_id']:
            if field in validated_data:
                old_value = getattr(instance, field.replace('_id', ''))
                new_value = validated_data[field]
                
                # Convert to string for comparison
                old_str = str(old_value) if old_value else None
                new_str = str(new_value) if new_value else None
                
                if old_str != new_str:
                    TicketHistory.objects.create(
                        ticket=instance,
                        user=user,
                        field_changed=field,
                        old_value=old_str,
                        new_value=new_str
                    )
        
        return super().update(instance, validated_data)


class TicketListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for ticket list views."""
    created_by = UserSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    comment_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Ticket
        fields = [
            'id', 'title', 'priority', 'status', 'category',
            'created_by', 'assigned_to', 'created_at', 'comment_count'
        ]
    
    def get_comment_count(self, obj):
        """Get the number of comments on this ticket."""
        return obj.comments.count()

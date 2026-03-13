"""
Admin configuration for tickets app.
"""
from django.contrib import admin
from .models import Ticket, Comment, TicketHistory


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    """Admin interface for Ticket model."""
    list_display = ['title', 'status', 'priority', 'category', 'created_by', 'assigned_to', 'created_at']
    list_filter = ['status', 'priority', 'category', 'created_at']
    search_fields = ['title', 'description']
    readonly_fields = ['created_at', 'updated_at', 'resolved_at', 'sentiment_score', 'auto_priority']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'category')
        }),
        ('Assignment & Status', {
            'fields': ('status', 'priority', 'created_by', 'assigned_to')
        }),
        ('NLP Analysis', {
            'fields': ('sentiment_score', 'auto_priority'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'resolved_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    """Admin interface for Comment model."""
    list_display = ['ticket', 'user', 'created_at', 'content_preview']
    list_filter = ['created_at']
    search_fields = ['content', 'ticket__title']
    readonly_fields = ['created_at']
    
    def content_preview(self, obj):
        """Show preview of comment content."""
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Content Preview'


@admin.register(TicketHistory)
class TicketHistoryAdmin(admin.ModelAdmin):
    """Admin interface for TicketHistory model."""
    list_display = ['ticket', 'field_changed', 'old_value', 'new_value', 'user', 'changed_at']
    list_filter = ['field_changed', 'changed_at']
    search_fields = ['ticket__title']
    readonly_fields = ['changed_at']

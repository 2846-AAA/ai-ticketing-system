"""
NLP Service for sentiment analysis and auto-prioritization.
"""
from textblob import TextBlob
import nltk
import re


class NLPService:
    """
    Service class for NLP operations including sentiment analysis.
    """
    
    # Keywords that indicate urgency
    URGENT_KEYWORDS = [
        'urgent', 'asap', 'immediately', 'critical', 'emergency', 'broken',
        'down', 'not working', 'crashed', 'error', 'fail', 'failure',
        'production', 'can\'t access', 'cannot access', 'losing money',
        'security breach', 'hack', 'data loss', 'outage'
    ]
    
    HIGH_PRIORITY_KEYWORDS = [
        'important', 'soon', 'priority', 'issue', 'problem', 'bug',
        'blocked', 'stuck', 'deadline', 'regression', 'performance'
    ]
    
    @staticmethod
    def download_nltk_data():
        """Download required NLTK data if not already present."""
        try:
            nltk.data.find('tokenizers/punkt')
        except LookupError:
            nltk.download('punkt', quiet=True)
        
        try:
            nltk.data.find('corpora/brown')
        except LookupError:
            nltk.download('brown', quiet=True)
    
    @classmethod
    def analyze_sentiment(cls, text):
        """
        Analyze sentiment of text using TextBlob.
        Returns a sentiment score between -1 (very negative) and 1 (very positive).
        """
        cls.download_nltk_data()
        
        if not text:
            return 0.0
        
        blob = TextBlob(text)
        # Polarity score ranges from -1 to 1
        return blob.sentiment.polarity
    
    @classmethod
    def detect_urgency_keywords(cls, text):
        """
        Detect urgency-related keywords in the text.
        Returns a tuple: (urgency_count, high_priority_count)
        """
        if not text:
            return (0, 0)
        
        text_lower = text.lower()
        
        urgent_count = sum(1 for keyword in cls.URGENT_KEYWORDS if keyword in text_lower)
        high_priority_count = sum(1 for keyword in cls.HIGH_PRIORITY_KEYWORDS if keyword in text_lower)
        
        return (urgent_count, high_priority_count)
    
    @classmethod
    def auto_prioritize(cls, title, description):
        """
        Automatically determine ticket priority based on NLP analysis.
        Returns: 'critical', 'high', 'medium', or 'low'
        """
        # Combine title and description for analysis
        full_text = f"{title} {description}"
        
        # Get sentiment score
        sentiment = cls.analyze_sentiment(full_text)
        
        # Detect urgency keywords
        urgent_count, high_priority_count = cls.detect_urgency_keywords(full_text)
        
        # Decision logic
        if urgent_count >= 2 or sentiment <= -0.5:
            return 'critical'
        elif urgent_count == 1 or high_priority_count >= 2 or sentiment <= -0.3:
            return 'high'
        elif high_priority_count == 1 or sentiment <= -0.1:
            return 'medium'
        else:
            return 'low'
    
    @classmethod
    def extract_keywords(cls, text, top_n=5):
        """
        Extract top keywords from text.
        """
        if not text:
            return []
        
        # Simple keyword extraction (can be enhanced with TF-IDF)
        words = re.findall(r'\b\w+\b', text.lower())
        # Filter out common words (basic stopwords)
        stopwords = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'is', 'are', 'was', 'were'}
        keywords = [word for word in words if word not in stopwords and len(word) > 3]
        
        # Count frequency
        from collections import Counter
        keyword_freq = Counter(keywords)
        
        return [word for word, count in keyword_freq.most_common(top_n)]
    
    @classmethod
    def suggest_category(cls, title, description):
        """
        Suggest ticket category based on content analysis.
        """
        full_text = f"{title} {description}".lower()
        
        # Category keywords
        category_keywords = {
            'technical': ['error', 'bug', 'crash', 'not working', 'broken', 'code', 'api', 'database'],
            'billing': ['invoice', 'payment', 'charge', 'subscription', 'refund', 'price', 'cost'],
            'bug_report': ['bug', 'error', 'issue', 'problem', 'wrong', 'incorrect', 'fail'],
            'feature_request': ['feature', 'add', 'new', 'would like', 'suggestion', 'improve', 'enhancement'],
        }
        
        # Count matches for each category
        category_scores = {}
        for category, keywords in category_keywords.items():
            score = sum(1 for keyword in keywords if keyword in full_text)
            category_scores[category] = score
        
        # Return category with highest score, or 'general' if no clear match
        if max(category_scores.values()) > 0:
            return max(category_scores, key=category_scores.get)
        return 'general'

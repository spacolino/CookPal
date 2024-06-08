from flask import request, jsonify
from flask_login import current_user
from .models import User
from .extensions import db
from datetime import datetime, timedelta

def check_token_limit(f):
    def decorated_function(*args, **kwargs):
        user = current_user

        if not user.is_authenticated:
            return jsonify({'error': 'User not authenticated'}), 403

        # Reset tokens if a day has passed
        if datetime.utcnow() > user.last_token_reset + timedelta(days=1):
            user.tokens_used_today = 0
            user.last_token_reset = datetime.utcnow()
            db.session.commit()

        required_tokens = kwargs.get('required_tokens', 0)
        if user.tokens_used_today + required_tokens > user.daily_token_limit:
            return jsonify({'error': 'Daily token limit exceeded'}), 403

        user.tokens_used_today += required_tokens
        db.session.commit()

        return f(*args, **kwargs)
    return decorated_function

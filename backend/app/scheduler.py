from .extensions import db
from .models import User
from datetime import datetime

def reset_daily_tokens():
    users = User.query.all()
    for user in users:
        user.tokens_used_today = 0
        user.last_token_reset = datetime.utcnow()
    db.session.commit()

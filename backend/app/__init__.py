from flask import Flask
from .extensions import db, migrate, cors, login_manager, bcrypt, oauth
from .config import Config
from .routes import main
from .models import User

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, resources={r"/*": {"origins": "*", "supports_credentials": True}})
    bcrypt.init_app(app)
    login_manager.init_app(app)
    oauth.init_app(app)
    
    oauth.register(
        name='google',
        client_id=app.config['GOOGLE_CLIENT_ID'],
        client_secret=app.config['GOOGLE_CLIENT_SECRET'],
        access_token_url='https://accounts.google.com/o/oauth2/token',
        # access_token_params=None,
        authorize_url='https://accounts.google.com/o/oauth2/auth',
        # authorize_params=None,
        # redirect_uri='http://localhost:5000/auth/callback',
        client_kwargs={'scope': 'openid profile email'}
    )

    login_manager.login_view = 'main.login'

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    app.register_blueprint(main)

    return app

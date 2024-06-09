from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_login import LoginManager
from flask_bcrypt import Bcrypt
from authlib.integrations.flask_client import OAuth

db = SQLAlchemy()
migrate = Migrate()
cors = CORS()
login_manager = LoginManager()
bcrypt = Bcrypt()
oauth = OAuth()
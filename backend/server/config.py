import os
from flask import Flask
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv

load_dotenv()
app = Flask(
    __name__,
    static_url_path='',
    static_folder='../frontend/build',
    template_folder='../frontend/build')
# )


app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.environ.get("SECRET_KEY")

# app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///foursils_db.db"
# app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
# app.config["JWT_SECRET_KEY"] = os.environ.get("SECRET_KEY")

db = SQLAlchemy()

migrate = Migrate(app, db)
db.init_app(app)

bcrypt = Bcrypt(app)

api = Api(app)


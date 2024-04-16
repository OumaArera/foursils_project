from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import os
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager

load_dotenv()

app = Flask(__name__)

postgres_db = os.environ.get("DATABASE_URL")
secret_key = os.environ.get("SECRET_KEY")

app.config["SQLALCHEMY_DATABASE_URI"] = postgres_db
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = secret_key

CORS(app, origins="*")
db = SQLAlchemy(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)


if __name__ == "__main__":
    app.run(debug=True)


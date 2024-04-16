from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import os
from flask_jwt_extended import JWTManager
from days.day import day_bp

app = Flask(__name__)

# Configure the app
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.environ.get("SECRET_KEY")


db = SQLAlchemy(app)  
migrate = Migrate(app, db)  
jwt = JWTManager(app) 


app.register_blueprint(day_bp)


CORS(app, origins="*")

if __name__ == "__main__":
    app.run(debug=True)


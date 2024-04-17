from flask import Flask, request, session, make_response, jsonify
from flask_restful import Api, Resource
from sqlalchemy.exc import IntegrityError
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from models import db
import os

# from config import app, db
from models import User,  Module, Course, CourseEnrolled, Note,  Lecture

app = Flask(__name__)

# app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///foursils_db.db"
# app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
# app.config["JWT_SECRET_KEY"] = "foursils phase4 project"

app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://foursils_user:C97GbqqN5ZE0Y7GCM4HwkcC6UYLWGxem@dpg-cof26ki1hbls7394bb40-a.oregon-postgres.render.com/foursils"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "foursils phase4 project"


db.init_app(app)
migrate = Migrate(app, db)


bcrypt = Bcrypt(app)

api = Api(app)


@app.route('/')
def index():
    return '<h1>Foursils Learning Backend</h1>'

# class Days(Resource):

@app.route('/user', methods=["GET"])
def get_days():
    users = User.query.all()
    user_dict = [{"id": user.id, 
                  "role": user.role,
                  "first_name": user.first_name, 
                  "middle_name": user.middle_name,
                  "last_name":user.last_name,
                  "email": user.email,
                  "password_hash": user.password_hash,
                  "reg_number": user.reg_number,
                  "staff_number": user.staff_number,
                  "created_at": user.created_at,
                  "last_login": user.last_login
                  } for user in users]
    if users:

        return jsonify(user_dict), 201
        # return [{"id": user1.id, "first_name": user1.first_name, "last_name":user1.last_name}]
        
    else:
        return jsonify({"error": "There are no users."})

@app.route("/signup", methods=["POST"])
def signup():
    pass
        
        


if __name__ == "__main__":
    app.run(debug=True)



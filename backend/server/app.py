from flask import Flask, request, session, make_response, jsonify
from flask_restful import Api
from sqlalchemy.exc import IntegrityError
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_restful import Api
# from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from sqlalchemy.exc import IntegrityError
from models import db
from datetime import datetime

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
jwt = JWTManager(app)

bcrypt = Bcrypt(app)

api = Api(app)


@app.route('/')
def index():
    return '<h1>Foursils Learning Backend</h1>'

# class Days(Resource):

@app.route('/user', methods=["GET"])
def get_users():
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
        response = make_response(
            jsonify(user_dict),
            200
        )
        response.headers["Content-Type"] = "application/json"
        return response
        
    else:
        return jsonify({"error": "There are no users."})
    

@app.route("/user/signup", methods=["POST"])
def signup():
    data = request.get_json()

    # Confirm if there is data from front end
    if not data:
        return jsonify({"error": "Invalid request"}), 400
    
    # Extract user data from request
    role = data.get("role")
    first_name = data.get("first_name")
    middle_name = data.get("middle_name")
    last_name = data.get("last_name")
    username = data.get("username")
    email = data.get("email")
    password = data.get("password_hash")
    reg_number = data.get("reg_number")
    staff_number = data.get("staff_number")
    last_login = data.get("last_login")

    user = User.query.filter_by(username=username).first()
    if user:
        return jsonify({'Error': 'User already exist'}), 200

    # Ensure the data from request is complete
    if not role or not first_name or not last_name or not username or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400
    
    # Hash the password
    password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    # Add new user
    new_user = User(
        role = role,
        first_name = first_name,
        middle_name = middle_name,
        last_name = last_name,
        username = username,
        email = email,
        password_hash = password_hash,
        reg_number = reg_number,
        staff_number = staff_number,
        created_at = datetime.utcnow(),
        last_login = last_login
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"Message": "Signup Successful"}), 200

    except Exception as err:
        db.session.rollback()
        return jsonify({"error": f"Failed to create user. Error: {err}"}), 400
    
@app.route("/user/signin", methods=["POST"])
def signin():
    data = request.get_json()

    # Confirm that there is data to login
    if not data:
        return jsonify({"error": "Invalid request"}), 400
    
    email = data.get("email")
    password = data.get("password_hash")

    # Confirm that user has entered a valid password
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400
    
    # Query user using email
    user = User.query.filter_by(email=email).first()
        
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid email or password"})

    # Create JWT token
    access_token = create_access_token(identity=user.id)

    # Update last login time
    user.last_login = datetime.utcnow()
    db.session.commit()

    return jsonify({"message": "Login successful", "access_token": access_token}), 200

@app.route("/user/profile", methods=["GET"])
@jwt_required()
def get_user_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user:
        return jsonify(user.serialize()), 200
    else:
        return jsonify({"error": "User not found"}), 404
    

@app.route("/user/delete/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_user(id):

    user = User.query.get(id)

    if not user:
        return jsonify({"Error": "Invalid user"}), 400
    
    try:
        Note.query.filter(Note.lecture_id.in_(db.session.query(Lecture.id).filter(Lecture.module_id.in_(db.session.query(Module.id).filter(Module.course_id.in_(db.session.query(Course.id).filter_by(instructor_id=id))))))).delete(synchronize_session=False)
        Lecture.query.filter(Lecture.module_id.in_(db.session.query(Module.id).filter(Module.course_id.in_(db.session.query(Course.id).filter_by(instructor_id=id))))).delete(synchronize_session=False)
        Module.query.filter(Module.course_id.in_(db.session.query(Course.id).filter_by(instructor_id=id))).delete(synchronize_session=False)
        Course.query.filter_by(instructor_id=id).delete()
        CourseEnrolled.query.filter_by(user_id=id).delete()
        
        db.session.delete(user)
        db.session.commit()
        return jsonify({"Message": "User deleted successfully"}), 200
    
    except IntegrityError as err:
        db.session.rollback()
        return jsonify({"Error": f"There was an error deleting user. {err}"}), 400
    
# @app.route("/user/logout", methods=["POST"])
# @jwt_required
# def logout_user():
#     pass

@app.route("/user/courses", methods=["GET"])
@jwt_required()
def get_all_courses():

    courses = Course.query.all()
    courses_list = [{
        "id": course.id,
        "title": course.title,
        "description": course.description,
        "instructor_id": course.instructor_id,
        "created_at": course.created_at,
        "updated_at": course.updated_at
    } for course in courses]

    if courses:
        response = make_response(
            jsonify(courses_list),
            200
        )
        response.headers["Content-Type"] = "application/json"

        return response
    else:
        return jsonify({"Error": "There are no courses avavilable"}), 201

@app.route("/user/create/courses", methods=["POST"])
@jwt_required()
def create_course():
    data = request.get_json()
    
    if not data:
        return jsonify({"Message": "Invalid request."}), 400
    
    title = data.get("title")
    description = data.get("description")
    instructor_id = data.get("instructor_id")
    created_at = datetime.utcnow()
    updated_at = data.get("updated_at")

    if not title or not description or not instructor_id or not created_at:
        return jsonify({"Message": "Missing required fields"}), 400
    
    new_course = Course(
        title = title,
        description = description,
        instructor_id = instructor_id,
        created_at = created_at,
        updated_at = updated_at
    )

    try:
        db.session.add(new_course)
        db.session.commit()
        return jsonify({"Message": "Courses Create Successfully"}), 201
    
    except Exception as err:
        db.session.rollback()
        return jsonify({"Error": f"There was an error creating the course. {err}"}), 400
    

@app.route("/user/edit/course/<int:id>", methods=["PUT"])
@jwt_required()
def modify_course(id):
    course = Course.query.get(id)

    if not course:
        return jsonify({"Message": "Course does not exist."}), 404
    
    data = request.get_json()

    if not data:
        return jsonify({"Message": "Invalid data"}), 400
    
    # Check if 'title' and 'description' are present in the data
    if 'title' not in data or 'description' not in data:
        return jsonify({"Message": "Title and description are required fields"}), 400
    
    """"
    _ Create a form that takes in new title and new description.
    - In case one of them is not being used, use the previous
    """

    # Update course title and description
    course.title = data['title']
    course.description = data['description']
    course.updated_at = datetime.utcnow()

    try:
        db.session.commit()
        return jsonify({"Message": "Course modified successfully"}), 200
    
    except Exception as err:
        db.session.rollback()
        return jsonify({"Message": f"There was an error in modifying the course. {err}"}), 400


@app.route("/user/module", methods=["GET"])
@jwt_required()
def get_modules():
    modules = Module.query.all()

    if not modules:
        return jsonify({"Message": "Module not available."}), 404
    
    modules_list = [{
        "id": module.id,
        "title": module.title,
        "description": module.description,
        "order": module.order,
        "course_id": module.course_id,
        "created_at": module.created_at,
        "updated_at": module.updated_at

    } for module in modules]

    response = make_response(
        jsonify(modules_list),
        200
    )
    response.headers["Content-Type"] = "application/json"
    return response

@app.route("/user/create/module", methods=["POST"])
@jwt_required()
def create_modules():
    data = request.get_json()

    if not data:
        return jsonify({"Message": "Invalid data."}), 400
    
    title = data.get("title")
    description = data.get("description")
    order = data.get("order")
    course_id = data.get("course_id")
    created_at = datetime.utcnow()
    updated_at = datetime.utcnow()

    if not title or not description or not order or not course_id:
        return jsonify({"Message": "Missing required data."}),400
    
    new_module = Module(
        title = title,
        description = description,
        order = order,
        course_id = course_id,
        created_at = created_at,
        updated_at = updated_at
    )

    try:
        db.session.add(new_module)
        db.session.commit()
        return jsonify({"Message": "Module created successfully"}), 201
    except Exception as err:
        return jsonify({"Message": f"There was an error creating the module. {err}"})


@app.route("/user/modify/module/<int:id>", methods=["PUT"])
@jwt_required()
def modify_module(id):
    module = Module.query.get(id)

    if not module:
        return jsonify({"Message": "Module not available"}), 400
    
    data = request.get_json()

    if "title" not in data or "description" not in data:
        return jsonify({"Message": "Missing required data."})
    
    # Modify module
    module.title = data["title"]
    module.description = data["description"]
    module.updated_at = datetime.utcnow()

    try:
        db.session.commit()
        return jsonify({"Message": "Module modified successfully"}), 201
    
    except Exception as err:
        return jsonify({"Message": f"There is an error modifying the module. {err}"}), 400


if __name__ == "__main__":
    app.run(debug=True)




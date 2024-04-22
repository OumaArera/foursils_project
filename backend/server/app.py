from flask import Flask, request, make_response, jsonify
from flask_restful import Api
from sqlalchemy.exc import IntegrityError
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_restful import Api
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from sqlalchemy.exc import IntegrityError
from models import db
from datetime import datetime
from flask_cors import CORS

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
CORS(app)


@app.route('/')
def index():
    return '<h1>Foursils Learning Backend</h1>'

@app.route('/user', methods=["GET"])
@jwt_required()
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
    last_login = datetime.utcnow()

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

    return jsonify({
        "message": "Login successful", 
        "access_token": access_token, 
        "user_id": user.id,
        "role": user.role,
        "username": user.username
        } 
        ), 200


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

    if not title or not description or not instructor_id:
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

    if "title" not in data or "description" not in data or "order" not in data:
        return jsonify({"Message": "Missing required data."})
    
    # Modify module
    module.title = data["title"]
    module.description = data["description"]
    module.order = data["order"]
    module.updated_at = datetime.utcnow()

    try:
        db.session.commit()
        return jsonify({"Message": "Module modified successfully"}), 201
    
    except Exception as err:
        db.session.rollback()
        return jsonify({"Message": f"There is an error modifying the module. {err}"}), 400


@app.route("/user/lecture", methods=["GET"])
@jwt_required()
def get_all_lectures():
    lectures = Lecture.query.all()

    if not lectures:
        return jsonify({"Message": "Lectures not available"}), 404
    
    lectures_list = [{
        "id": lecture.id,
        "title": lecture.title,
        "video_url": lecture.video_url,
        "duration": lecture.duration,
        "module_id": lecture.module_id,
        "created_at": lecture.created_at,
        "updated_at": lecture.updated_at

    } for lecture in lectures]

    response = make_response(
        jsonify(lectures_list),
        200
    )
    response.headers["Content-Type"] = "application/json"
    return response


@app.route("/user/create/lecture", methods=["POST"])
@jwt_required()
def create_new_lecture_video():
    data = request.get_json()

    if not data:
        return jsonify({"Message": "Invalid request."}), 404
    
    title = data.get("title")
    video_url = data.get("video_url")
    duration = data.get("duration")
    module_id = data.get("module_id")
    created_at =datetime.utcnow()
    updated_at = datetime.utcnow()

    if not title or not video_url or not duration or not module_id:
        return jsonify({"Message": "Missing required data."}), 400
    
    new_lecture = Lecture(
        title = title,
        video_url = video_url,
        duration = duration,
        module_id = module_id,
        created_at = created_at,
        updated_at = updated_at
    )

    try:
        db.session.add(new_lecture)
        db.session.commit()
        return jsonify({"Message": "Lecture created successfully."}), 200
    
    except Exception as err:
        return jsonify({"Message": f"There was an error creating module. {err}"}), 400


@app.route("/user/edit/lecture/<int:id>", methods=["PUT"])
@jwt_required()
def modify_lecture(id):

    lecture = Lecture.query.get(id)

    if not lecture:
        return jsonify({"Message": "Invalid lecture."}), 404
    
    data = request.get_json()

    if "title" not in data or "video_url" not in data or "duration" not in data:
        return jsonify({"Message": "Missing required fields."}), 400
    
    lecture.title = data["title"]
    lecture.video_url = data["video_url"]
    lecture.duration = data["duration"]

    try:
        db.session.commit()
        return jsonify({"Message": "Lecture modified successfully"}), 200
    
    except Exception as err:
        db.session.rollback()
        return jsonify({"Message": f"There was an error modifying the lecture. {err}"})
    

@app.route("/user/notes", methods=["GET"])
@jwt_required()
def get_all_notes():

    notes = Note.query.all()

    if not notes:
        return jsonify({"Message": "Notes not available."}), 404
    
    notes_list = [{
        "id": note.id,
        "topic": note.topic,
        "content": note.content,
        "lecture_id": note.lecture_id,
        "created_at": note.created_at,
        "updated_at": note.updated_at

    } for note in notes]

    response = make_response(
        jsonify(notes_list),
        200
    )
    response.headers["Content-Type"] = "application/json"

    return response


@app.route("/user/create/notes", methods=["POST"])
@jwt_required()
def create_notes():
    data = request.get_json()

    if not data:
        return jsonify({"Message": "Invalid data"}), 404
    
    topic = data.get("topic")
    content = data.get("content")
    lecture_id = data.get("lecture_id")
    created_at = datetime.utcnow()
    updated_at = datetime.utcnow()

    if not topic or not content or not lecture_id:
        return jsonify({"Message": "Missing required data."}), 400
    
    new_notes = Note(
        topic = topic,
        content = content,
        lecture_id = lecture_id,
        created_at = created_at,
        updated_at = updated_at
    )

    try:
        db.session.add(new_notes)
        db.session.commit()
        return jsonify({"Message": "Notes created successfully"}), 200
    
    except Exception as err:
        db.session.rollback()
        return jsonify({"Message": f"There was an error createing notes. {err}"})


@app.route("/user/modify/notes/<int:id>", methods=["PUT"])
@jwt_required()
def modify_notes(id):
    note = Note.query.get(id)

    if not note:
        return jsonify({"Message": "Notes not available"}), 404
    
    data = request.get_json()

    if "topic" not in data or "content" not in data or "lecture_id" not in data:
        return jsonify({"Message": "Missing required fields"}), 400
    
    note.topic = data["topic"]
    note.content = data["content"]
    note.lecture_id = data["lecture_id"]

    try:
        db.session.commit()
        return jsonify({"Message": "Notes modified successfully"}), 200
    
    except Exception as err:
        db.session.rollback()
        return jsonify({"Message": f"There was an error in modifyning notes {err}"})


@app.route("/user/courses/enrolled", methods=["GET"])
@jwt_required()
def get_all_enrolled_courses():

    enrolled_courses_data = CourseEnrolled.query.all()

    if not enrolled_courses_data:
        return jsonify({"Message": f"You have not enrolled in any course"}), 404
    
    enrolled_courses_list = []
    for course_enrolled in enrolled_courses_data:
        # Fetch course details
        course = Course.query.get(course_enrolled.course_id)
        # Fetch student details
        student = User.query.get(course_enrolled.user_id)

        student_name = f"{student.first_name} {student.last_name}"
        if student.middle_name is not None:
            student_name = f"{student.first_name} {student.middle_name} {student.last_name}"

        enrolled_courses_list.append({
            "id": course_enrolled.id,
            "user_id": course_enrolled.user_id,
            "course_id": course_enrolled.course_id,
            "enrollment_date": course_enrolled.enrollment_date,
            "registration_id": course_enrolled.registration_id,
            "course_title": course.title,
            "student_name": student_name,
            "student_email": student.email
        })

    response = make_response(
        jsonify(enrolled_courses_list),
        200
    )
    response.headers["Content-Type"] = "application/json"

    return response

@app.route("/user/enroll", methods=["POST"])
@jwt_required()
def enroll_for_a_course():

    data = request.get_json()

    if "course_id" not in data or "user_id" not in data:
        return jsonify({"Message": "Invalid data"}), 404
    
    """
    - Create a form that has two inputs
    - One, to fetch user.id from the user data you stored in localStorage
    - Two, to store course id. 
    - When user clicks on "enroll" button, collect courses.id and send it together with users.id to backend
    """
    
    course_id = data.get("course_id")
    user_id = data.get("user_id")
    registration_id = data.get("course_id")
    enrollment_date = datetime.utcnow()

    existing_enrollment = CourseEnrolled.query.filter_by(course_id=course_id, user_id=user_id).first()
    if existing_enrollment:
        return jsonify({"Message": "You are already enrolled in this course."}), 400

    if not course_id or not user_id or not registration_id:
        return jsonify({"Message": "Missing required data."}), 404

    # Create course
    new_course = CourseEnrolled(
        course_id = course_id,
        user_id = user_id,
        registration_id = registration_id,
        enrollment_date = enrollment_date
    )

    try:
        db.session.add(new_course)
        db.session.commit()
        return jsonify({"Message": "Enrolled successfully"}), 200
    
    except Exception as err:
        db.session.rollback()
        return jsonify({"Message": f"There was a problem in enrolling. {err}"}), 400


@app.route("/user/search/courses/<string:query>", methods=["GET"])
@jwt_required()
def search_course_by_name(query):
    # Split the query string into individual words and convert them to lowercase
    query_words = query.lower().split()

    # Initialize an empty list to store the search results
    search_results = []

    # Iterate over each course and search for courses that exactly match any of the query words
    for course in Course.query.all():
        # Split the course title into individual words and convert them to lowercase
        title_words = course.title.lower().split()

        # Check if any of the query words exactly match any of the title words
        if any(query_word == title_word for query_word in query_words for title_word in title_words):
            search_results.append(course)

    if not search_results:
        return jsonify({"Message": f"No matches for {query}"}), 404
    
    courses_list = [{
        "id": course.id,
        "title": course.title,
        "description": course.description,
        "instructor_id": course.instructor_id,
        "created_at": course.created_at,
        "updated_at": course.updated_at
    } for course in search_results]

    response = make_response(
        jsonify(courses_list),
        200
    )
    response.headers["Content-Type"] = "application/json"

    return response


@app.route("/user/my/courses/<int:id>", methods=["GET"])
@jwt_required()
def get_my_courses(id):
    # Query the CourseEnrolled table to get the enrolled courses for the specified user ID
    enrolled_courses_data = CourseEnrolled.query.filter_by(user_id=id).all()

    if not enrolled_courses_data:
        return jsonify({"Message": "You have not enrolled in any course."}), 404
    
    # Initialize an empty list to store the details of enrolled courses
    enrolled_courses_list = []

    # Iterate over each enrolled course data
    for course_enrolled in enrolled_courses_data:
        # Fetch course details from the Course table
        course = Course.query.get(course_enrolled.course_id)
        if course:
            # Append the details of the enrolled course to the list
            enrolled_courses_list.append({
                "id": course.id,
                "title": course.title,
                "description": course.description,
                "instructor_id": course.instructor_id,
                "created_at": course.created_at,
                "updated_at": course.updated_at,
                "enrollment_date": course_enrolled.enrollment_date,
                "registration_id": course_enrolled.registration_id
            })

    # Create a response with the details of enrolled courses
    response = make_response(
        jsonify(enrolled_courses_list),
        200
    )
    response.headers["Content-Type"] = "application/json"

    return response


@app.route("/user/drop/course/<int:id>", methods=["DELETE"])
@jwt_required()
def drop_course(id):
    
    course_to_drop = CourseEnrolled.query.get(id)

    if not course_to_drop:
        return jsonify({"Message": "Course does not exist."})
    
    try:
        db.session.delete(course_to_drop)
        return jsonify({"Message": "Course dropped successfully"})
    
    except Exception as err:
        db.session.rollback()
        return jsonify({"Message": f"There was an error dropping the course. {err}"})



if __name__ == "__main__":
    app.run(debug=True)







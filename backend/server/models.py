from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey
from flask_migrate import Migrate
from datetime import datetime

db = SQLAlchemy()
migrate = Migrate()


class Registration(db.Model):
    __tablename__ = "register"

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    middle_name = db.Column(db.String(100), nullable=True)
    last_name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False) 
    reg_number = db.Column(db.String(20), nullable=True)
    staff_number = db.Column(db.String(20), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship('User', back_populates='registration')
    register = db.relationship("CourseEnrolled", back_populates = "registration")


class Authentication(db.Model):
    __tablename__ = "authentication"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    last_login = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship('User', back_populates='authentication')


class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    registration_id = db.Column(db.Integer, ForeignKey('registration.id'), nullable=False)
    registration = db.relationship('Registration', back_populates='user')
    authentication_id = db.Column(db.Integer, ForeignKey('authentication.id'), nullable=False)
    authentication = db.relationship('Authentication', back_populates='user')
    courses_enrolled = db.relationship('CourseEnrolled', back_populates='user')

# --------- FIRST PHASE -------------
class Course(db.Model):
    __tablename__ = "course"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    instructor_id = db.Column(db.Integer, ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    instructor = db.relationship('User', back_populates='courses_taught', lazy=True)
    students_enrolled = db.relationship('CourseEnrolled', back_populates='course', lazy=True)
    modules = db.relationship('Module', backref='course', lazy=True)


class Module(db.Model):
    __tablename__ = "module"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    order = db.Column(db.Integer, nullable=False)
    course_id = db.Column(db.Integer, ForeignKey('course.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    day = db.relationship('Day', back_populates='modules')


class Day(db.Model):
    __tablename__ = "day"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    course_id = db.Column(db.Integer, ForeignKey('course.id'), nullable=False)
    modules = db.relationship('Module', back_populates='day', lazy=True)


class Lecture(db.Model):
    __tablename__ = "lecture"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    video_url = db.Column(db.String(500), nullable=True)  
    duration = db.Column(db.String(20), nullable=False)
    module_id = db.Column(db.Integer, ForeignKey('module.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    notes = db.relationship('Note', back_populates='lecture')


class Notes(db.Model):
    __tablename__ = "notes"

    id = db.Column(db.Integer, primary_key=True)
    topic = db.Column(db.String(300), nullable=False)
    content = db.Column(db.Text, nullable=False)
    lecture_id = db.Column(db.Integer, ForeignKey('lecture.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    lecture = db.relationship('Lecture', back_populates='notes')

# -----------SECOND PHASHE ------------

class Assignments(db.Model):
    __tablename__ = "assignments"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    due_date = db.Column(db.DateTime, nullable=False)
    type = db.Column(db.String(20), nullable=False)  
    module_id = db.Column(db.Integer, ForeignKey('module.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Choices(db.Model):
    __tablename__ = "choices"

    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, ForeignKey('question.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    is_correct = db.Column(db.Boolean, default=False, nullable=False)


class Questions(db.Model):
    __tablename__ = "questions"

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(20), nullable=False) 
    choices = db.relationship('Choice', backref='question', lazy=True)
    responses = db.relationship('Response', backref='question', lazy=True)


class Responses(db.Model):
    __tablename__ = "responses"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey('user.id'), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)
    answer = db.Column(db.String(200), nullable=False)
    is_correct = db.Column(db.Boolean, nullable=False)


class AssignmentPerformance(db.Model):
    __tablename__ = "assignment_performance"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey('user.id'), nullable=False)
    assignment_id = db.Column(db.Integer, db.ForeignKey('assignment.id'), nullable=False)
    score = db.Column(db.Float, nullable=False)


class CourseEnrolled(db.Model):
    __tablename__ = "course_enrolled"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey('user.id'), nullable=False)
    course_id = db.Column(db.Integer, ForeignKey('course.id'), nullable=False)
    enrollment_date = db.Column(db.DateTime, default=datetime.utcnow)
    student = db.relationship('User', back_populates='courses_enrolled')
    course = db.relationship('Course', back_populates='students_enrolled')
    registration = db.relationship("Registration", back_populates="course_enrolled")
    reg_id = db.Column(db.Integer, ForeignKey("register.id"), nullable=False)




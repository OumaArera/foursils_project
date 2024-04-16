from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey
from datetime import datetime
from sqlalchemy_serializer import SerializerMixin
from config import db

db = SQLAlchemy()


class User(db.Model, SerializerMixin):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(20), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    middle_name = db.Column(db.String(100), nullable=True)
    last_name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    reg_number = db.Column(db.String(20), nullable=True)
    staff_number = db.Column(db.String(20), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime, default=datetime.utcnow)
    courses_taught = db.relationship('Course', back_populates='instructor', lazy=True)
    course_enrolled = db.relationship('CourseEnrolled', back_populates='user', foreign_keys='CourseEnrolled.user_id')


class Course(db.Model, SerializerMixin):
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

class Module(db.Model, SerializerMixin):
    __tablename__ = "module"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    order = db.Column(db.Integer, nullable=False)
    course_id = db.Column(db.Integer, ForeignKey('course.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Lecture(db.Model, SerializerMixin):
    __tablename__ = "lecture"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    video_url = db.Column(db.String(500), nullable=True)  
    duration = db.Column(db.String(20), nullable=False)
    module_id = db.Column(db.Integer, ForeignKey('module.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Note(db.Model, SerializerMixin):
    __tablename__ = "notes"

    id = db.Column(db.Integer, primary_key=True)
    topic = db.Column(db.String(300), nullable=False)
    content = db.Column(db.Text, nullable=False)
    lecture_id = db.Column(db.Integer, ForeignKey('lecture.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class CourseEnrolled(db.Model, SerializerMixin):
    __tablename__ = "course_enrolled"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    enrollment_date = db.Column(db.DateTime, default=datetime.utcnow)
    registration_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  
    registration = db.relationship('User', backref='enrolled_courses', foreign_keys=[registration_id])
    course = db.relationship('Course', back_populates='students_enrolled')
    user = db.relationship('User', back_populates='course_enrolled', foreign_keys=[user_id])




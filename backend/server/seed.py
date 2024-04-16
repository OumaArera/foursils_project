from app import db, app
from models import User, Course, Module, Lecture, Note, CourseEnrolled
from datetime import datetime

def seed_data():
    db.create_all()
    user1 = User(
        role='student',
        first_name='John',
        last_name='Doe',
        username='johndoe',
        email='john@example.com',
        password_hash='password123'
    )
    user2 = User(
        role='instructor',
        first_name='Jane',
        last_name='Smith',
        username='janesmith',
        email='jane@example.com',
        password_hash='password456'
    )

    db.session.add_all([user1, user2])
    db.session.commit()

    # Create Courses
    course1 = Course(
        title='Introduction to Python',
        description='Learn the basics of Python programming language',
        instructor_id=user2.id,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    course2 = Course(
        title='Web Development Fundamentals',
        description='Introduction to web development technologies',
        instructor_id=user2.id,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.session.add_all([course1, course2])
    db.session.commit()

    # Create Modules
    module1 = Module(
        title='Python Basics',
        description='Introduction to Python syntax and basic concepts',
        order=1,
        course_id=course1.id,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    module2 = Module(
        title='HTML Basics',
        description='Learn the fundamentals of HTML',
        order=1,
        course_id=course2.id,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.session.add_all([module1, module2])
    db.session.commit()

    # Create Lectures
    lecture1 = Lecture(
        title='Variables and Data Types',
        video_url='https://www.youtube.com/watch?v=xyz123',
        duration='10:00',
        module_id=module1.id,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    lecture2 = Lecture(
        title='HTML Tags',
        video_url='https://www.youtube.com/watch?v=abc456',
        duration='15:00',
        module_id=module2.id,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.session.add_all([lecture1, lecture2])
    db.session.commit()

    # Create Notes
    note1 = Note(
        topic='Python Variables',
        content='Variables are used to store data in Python',
        lecture_id=lecture1.id,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    note2 = Note(
        topic='HTML Basics',
        content='HTML is used to create the structure of web pages',
        lecture_id=lecture2.id,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.session.add_all([note1, note2])
    db.session.commit()

    # Enroll Users in Courses
    enrollment1 = CourseEnrolled(
        user_id=user1.id,
        course_id=course1.id,
        enrollment_date=datetime.utcnow(),
        registration_id=user1.id
    )
    enrollment2 = CourseEnrolled(
        user_id=user1.id,
        course_id=course2.id,
        enrollment_date=datetime.utcnow(),
        registration_id=user1.id
    )

    db.session.add_all([enrollment1, enrollment2])
    db.session.commit()

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        seed_data()
        print("Data seeded successfully.")


    

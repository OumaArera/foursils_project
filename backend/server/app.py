from flask import request, session, make_response, jsonify
from flask_restful import Api, Resource
from sqlalchemy.exc import IntegrityError

from config import app, db
from models import User,  Module, Course, CourseEnrolled, Note,  Lecture

api = Api(app)

@app.route('/')
def index():
    return '<h1>Foursils Learning Backend</h1>'

class Days(Resource):

    @app.route('/days', methods=["GET"])
    def get_days():
        days = User.query.all()
        days_list = []

        # if days:

        #     days_list = [{"id": day.id, "title": day.title, "course_id": day.course_id,} for day in days]
            
        # else:
        #     return jsonify({"error": "There are no days."})
        
        return jsonify(days), 200




if __name__ == "__main__":
    app.run(debug=True)



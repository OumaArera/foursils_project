from flask import Blueprint, jsonify
from models import Day

# Database blueprint
day_bp = Blueprint('day', __name__)

# Fetch days from the db and return a json format
@day_bp.route('/days', methods=["GET"])
def get_days():
    days = Day.query.all()
    days_list = []

    # Confirm if there is data in the db
    if days:

        # Iterate through the data and store it as a dictionary
        for day in days:
            each_day = {
                "id": day.id,
                "title": day.title,
                "course_id": day.course_id,
            }
            days_list.append(each_day)
    else:
        return jsonify({"error": "There are no days."})
    
    return jsonify(days_list), 200
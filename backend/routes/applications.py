"""
This module contains the routes for managing applications.
"""

from flask import Blueprint, jsonify, request
import json
from models import Users, get_new_application_id
from utils import get_userid_from_header
from datetime import datetime

applications_bp = Blueprint("applications", __name__)


@applications_bp.route("/applications", methods=["GET"])
def get_data():
    """
    Gets user's applications data from the database

    :return: JSON object with application data
    """
    try:
        userid = get_userid_from_header()
        user = Users.objects(id=userid).first()
        applications = user["applications"]
        return jsonify(applications)
    except:
        return jsonify({"error": "Internal server error"}), 500


@applications_bp.route("/applications", methods=["POST"])
def add_application():
    """
    Add a new job application for the user

    :return: JSON object with status and message
    """
    try:
        userid = get_userid_from_header()
        request_data = json.loads(request.data)["application"]
        try:
            assert "title" in request_data
            assert "company" in request_data
        except:
            return jsonify({"error": "Missing fields in input"}), 400

        user = Users.objects(id=userid).first()
        current_application = {
            "id": get_new_application_id(userid),
            "title": request_data["title"],
            "company": request_data["company"],
            "link": request_data.get("link"),
            "location": request_data.get("location"),
            "type": request_data.get("type"),
            "status": request_data.get("status", "1"),
            "date": datetime.now().strftime("%m/%d/%Y"),
            "externalId": request_data.get("id"),
            "interviewDate": request_data.get("interviewDate") or None,
            "startTime": request_data.get("startTime") or None,
            "endTime": request_data.get("endTime") or None,
            "sent_notifications": [],
        }

        applications = user["applications"] + [current_application]
        user.update(applications=applications)
        return jsonify(current_application), 200
    except Exception as err:
        print(err)
        return jsonify({"error": "Internal server error"}), 500


@applications_bp.route("/applications/<int:application_id>", methods=["PUT"])
def update_application(application_id):
    """
    Updates the existing job application for the user

    :param application_id: Application id to be modified
    :return: JSON object with status and message
    """
    try:
        userid = get_userid_from_header()
        request_data = json.loads(request.data)["application"]
        user = Users.objects(id=userid).first()
        current_applications = user["applications"]

        for item in request_data.items():
            print(item)

        if len(current_applications) == 0:
            return jsonify({"error": "No applications found"}), 400
        else:
            updated_applications = []
            app_to_update = None
            application_updated_flag = False
            for application in current_applications:
                if application["id"] == application_id:
                    app_to_update = application
                    application_updated_flag = True
                    application["sent_notifications"] = []
                    for key, value in request_data.items():
                        print(key)
                        application[key] = value
                updated_applications += [application]
            if not application_updated_flag:
                return jsonify({"error": "Application not found"}), 400
            user.update(applications=updated_applications)

        return jsonify(app_to_update), 200
    except:
        return jsonify({"error": "Internal server error"}), 500


@applications_bp.route("/applications/<application_id>", methods=["DELETE"])
def delete_application(application_id):
    """
    Deletes the given job application for the user

    :param application_id: Application id to be modified
    :return: JSON object with status and message
    """
    try:
        userid = get_userid_from_header()
        user = Users.objects(id=userid).first()
        current_applications = user["applications"]
        application_deleted_flag = False
        app_to_delete = None
        application_id = int(application_id)

        updated_applications = [
            app for app in current_applications if app["id"] != application_id
        ]

        user.update(set__applications=updated_applications)
        return jsonify(app_to_delete), 200
    except:
        return jsonify({"error": "Internal server error"}), 500

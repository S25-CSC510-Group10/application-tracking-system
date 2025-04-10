"""
This module contains the routes for managing user profiles.
"""

from flask import Blueprint, jsonify, request
import json
from models import Users
from utils import get_userid_from_header
from pywebpush import webpush, WebPushException
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
import pytz

notifications_bp = Blueprint("notifications", __name__)

public_vapid_key = "BFzhADCx0ap9hQzsZD9qZ_bEKLh9eFZSFmljL5o5HTdY-whZ80yGTBlaKev9warqy58ZRJtWpRreTG9n_e2xg7Y"
private_vapid_key = "Fcq5ZFcGF3NSemU0vJEGg5AcaJEdPLGWDA4CmFj4VqQ"
vapid_claims = {"sub": "mailto:you@example.com"}


scheduler = BackgroundScheduler({"apscheduler.timezone": "EST"})


@notifications_bp.route("/subscribe", methods=["POST"])
def subscribe():
    try:
        userid = get_userid_from_header()
        user = Users.objects(id=userid).first()
        sub = request.get_json()
        user.update(set__subscription_info=sub)
        return jsonify({"status": "subscribed"}), 200
    except Exception as ex:
        print(f"The following occurred:{ex}")
        return jsonify({"Error": f"The following occurred:{ex}"}), 500


@notifications_bp.route("/subscribe", methods=["GET"])
def isSubscribed():
    try:
        userid = get_userid_from_header()
        user = Users.objects(id=userid).first()
        sub = user["subscription_info"]

        if sub:
            return jsonify({"subscribed": True, "subscription_info": sub}), 200
        return jsonify({"subscribed": False, "message": "No subscription"}), 200
    except Exception as ex:
        print(f"The following occurred:{ex}")
        return jsonify({"Error": f"{ex}"}), 500


@notifications_bp.route("/notify", methods=["POST"])
def notify():
    userid = get_userid_from_header()
    user = Users.objects(id=userid).first()
    user_sub_info = user["subscription_info"]

    data = request.get_json()
    title = data.get("title", "Hello!")
    body = data.get("body", "This is a push notification.")

    try:
        notify_subscription_info(user_sub_info, title, body)
    except WebPushException as ex:
        print(f"Failed to send notification: {ex}")
        return jsonify({"status": f"Error: {ex}"}), 500
    return jsonify({"status": "notifications sent"}), 200


def notify_subscription_info(user_sub_info, title, body):
    webpush(
        subscription_info=user_sub_info,
        data=json.dumps({"title": title, "body": body}),
        vapid_private_key=private_vapid_key,
        vapid_claims=vapid_claims,
    )


notification_time_format = f"%m/%d @ %H:%M"
interview_date_format = f"%Y-%m-%d %H:%M"
eastern = pytz.timezone("US/Eastern")
utc = pytz.timezone("UTC")


def scheduled_interview_notification():
    for user in Users.objects():
        for app in user["applications"]:
            if app.get("interviewDate", False) and app.get("startTime", False):

                # YYYY-mm-dd HH:MM
                interview_start = f"{app['interviewDate']} {app['startTime']}"

                start_time = eastern.localize(
                    datetime.strptime(interview_start, interview_date_format)
                )
                notify_start_time = start_time - timedelta(minutes=30)
                notify_end_time = start_time
                current_time = datetime.now(eastern)

                if (
                    notify_start_time <= current_time
                    and current_time <= notify_end_time
                ):
                    sub_info = user["subscription_info"]
                    title = f"Upcoming Interview"
                    body = f"You have an upcoming interview on {start_time.astimezone(eastern).strftime(notification_time_format)}"
                    notify_subscription_info(sub_info, title, body)
    return None


notify_interview_job = scheduler.add_job(
    scheduled_interview_notification, "interval", minutes=10
)

scheduler.start()

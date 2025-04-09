"""
This module contains the routes for managing user profiles.
"""

from flask import Blueprint, jsonify, request
import json
from models import Users
from utils import get_userid_from_header
from pywebpush import webpush, WebPushException

notifications_bp = Blueprint("notifications", __name__)

public_vapid_key = "BFzhADCx0ap9hQzsZD9qZ_bEKLh9eFZSFmljL5o5HTdY-whZ80yGTBlaKev9warqy58ZRJtWpRreTG9n_e2xg7Y"
private_vapid_key = "Fcq5ZFcGF3NSemU0vJEGg5AcaJEdPLGWDA4CmFj4VqQ"
vapid_claims = {"sub": "mailto:you@example.com"}


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
        webpush(
            subscription_info=user_sub_info,
            data=json.dumps({"title": title, "body": body}),
            vapid_private_key=private_vapid_key,
            vapid_claims=vapid_claims,
        )
    except WebPushException as ex:
        print(f"Failed to send notification: {ex}")
        return jsonify({"status": f"Error: {ex}"}), 500
    return jsonify({"status": "notifications sent"}), 200

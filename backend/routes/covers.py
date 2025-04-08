"""
This module contains the routes for uploading and downloading cover letters.
"""

from flask import Blueprint, jsonify, request, send_file
from models import Users
from utils import get_userid_from_header
from db import db
from config import config
from langchain_ollama import OllamaLLM
from mongoengine.fields import FileField


cover_bp = Blueprint("cover", __name__)

@cover_bp.route("/cover_letters", methods=["GET"])
def get_cover_letters():
    """
    Retrieves the list of cover letter filenames for the user
    
    :return list of filenames
    """
    userid = get_userid_from_header()
    try:
        user = Users.objects(id=userid).first()
        if not user.covers:
            raise FileNotFoundError
        
    except:
        return jsonify({"error": "cover letter could not be found"}), 400
    
    filenames = [
        cover.filename or f"cover_{index}.pdf" for index, cover in enumerate(user.covers)
    ]
    
    return jsonify({"filenames": filenames}), 200

@cover_bp.route("/cover_letters/<int:cover_idx>", methods=["GET"])
def get_cover_letter_file(cover_idx):
    """
    Retrieves a cover letter file by index
    
    :param cover_idx: index of the cover letter
    :return: response with cover letter attached
    """
    userid = get_userid_from_header()
    try:
        user = Users.objects(id=userid).first()
        if not user.covers or cover_idx >= len(user.covers):
            raise FileNotFoundError
        
    except:
        return jsonify({"error": "cover letter could not be foudn"}), 400
    
    cover = user.covers[cover_idx]
    cover.seek(0)
    filename = cover.filename or f"cover_{cover_idx}.pdf"
    
    response = send_file(
        cover,
        mimetype="application/pdf",
        download_name=filename,
        as_attachment=True
    )
    response.headers["x-filename"] = filename
    response.headers["Access-Control-Expose-Headers"] = "x-filename"
    return response, 200

@cover_bp.route("/cover_letters", methods=["POST"])
def upload_cover_letter():
    try:
        userid = get_userid_from_header()
        user = Users.objects(id=userid).first()

        try:
            file = request.files["file"]
        except:
            return jsonify({"error": "No cover letter found in the input"}), 400

        file.seek(0)
        new_file = db.GridFSProxy()
        new_file.put(
            file,
            filename=file.filename,
            content_type="application/pdf"
        )
        user.covers.append(new_file)
        user.save()
        return jsonify({"message": "cover letter successfully added"}), 200
    
    except Exception as e:
        print("Upload failed:", e)
        return jsonify({"error": "Internal server error"}), 500

@cover_bp.route("/cover_letters/<int:cover_idx>", methods=["DELETE"])
def delete_cover_letter(cover_idx):
    """
    Deletes a cover letter by id
    
    :param cover_idx: index of cover letter to delete
    :return: response
    """
    userid = get_userid_from_header()
    try:
        user = Users.objects(id=userid).first()
        if not user.covers or cover_idx >= len(user.covers):
            raise FileNotFoundError
        
    except:
        return jsonify({"error": "cover letter could not be found"}), 400
    
    del user.covers[cover_idx]
    user.save()
    return jsonify({"success": "successfully deleted cover letter"}), 200
"""
This module contains the routes for uploading and downloading cover letters.
"""

from flask import Blueprint, jsonify, request, send_file
from models import Users
from utils import get_userid_from_header
from db import db
from config import config
from langchain_ollama import OllamaLLM

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


"""
The flask application for our program
"""

from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
from authlib.integrations.flask_client import OAuth
from config import config
from db import db
from utils import middleware

from routes.auth import auth_bp
from routes.profile import profile_bp
from routes.applications import applications_bp
from routes.resume import resume_bp
from routes.jobs import jobs_bp
from routes.notifications import notifications_bp


def create_app():
    """
    Creates and initializes the Flask application
    """

    app = Flask(__name__)
    CORS(app)

    # Initialize OAuth
    oauth = OAuth(app)
    auth_bp.oauth = oauth

    # Set configuration
    app.secret_key = config["SECRET_KEY"]
    app.config["MONGODB_SETTINGS"] = {
        "db": "appTracker",
        "host": f"mongodb+srv://{config['USERNAME']}:{config['PASSWORD']}@{config['CLUSTER_URL']}/?retryWrites=true&w=majority&appName=csc510-project3/",
        # "host": f"mongodb+srv://{config['USERNAME']}:{config['PASSWORD']}@csc510-project3.p6lxg.mongodb.net/?retryWrites=true&w=majority&appName=csc510-project3",
    }

    db.init_app(app)

    # Register middleware
    app.before_request(middleware(["/applications", "/resume"]))

    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(applications_bp)
    app.register_blueprint(resume_bp)
    app.register_blueprint(jobs_bp)
    app.register_blueprint(notifications_bp)

    @app.route("/")
    @cross_origin()
    # pylint: disable=unused-variable
    def health_check():
        return jsonify({"message": "Server up and running"}), 200

    return app


if __name__ == "__main__":
    app = create_app()

    app.run(host="0.0.0.0", port=5000, debug=True)

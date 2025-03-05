import os
from typing import Union
from flask import Flask, request, jsonify, render_template, make_response
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore, auth
from functools import wraps
from dotenv import load_dotenv

from utils import format_code

load_dotenv()

app = Flask(__name__)
CORS(app)
app.secret_key = os.urandom(24)
app.config["TEMPLATES_AUTO_RELOAD"] = True


# Initialize Firebase
cred = credentials.Certificate("./service-account-key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()


# Authentication decorator
def firebase_auth(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = request.headers.get("Authorization", "").split("Bearer ")[-1]
        if not token:
            return jsonify({"error": "Unauthorized"}), 401
        try:
            decoded_token = auth.verify_id_token(token)
            request.user = decoded_token
        except Exception as e:
            return jsonify({"error": str(e)}), 401
        return f(*args, **kwargs)

    return wrapper


# Routes
@app.route("/")
def home():
    firebase_config = {
        "apiKey": os.getenv("FIREBASE_API_KEY"),
        "authDomain": os.getenv("FIREBASE_AUTH_DOMAIN"),
        "projectId": os.getenv("FIREBASE_PROJECT_ID"),
        "storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET"),
        "messagingSenderId": os.getenv("FIREBASE_MESSAGING_SENDER_ID"),
        "appId": os.getenv("FIREBASE_APP_ID"),
    }
    return render_template("login.html", firebase_config=firebase_config)


@app.get("/embed/<embed_id>")
def show_embed(embed_id: str):
    doc = db.collection("embeds").document(embed_id).get()
    
    extra_param_1 = request.args.get('extra_param_1')
    extra_param_2 = request.args.get('extra_param_2')
    
    if doc.exists:
        html_content: str = doc.to_dict().get("code", "")

        html_content = format_code(doc.to_dict(), extra_param_1, extra_param_2)
        
        response = make_response(html_content)
        response.headers["Content-Type"] = "text/html"
        return response
    return "Embed not found", 404


# API Endpoints
@app.route("/api/embeds", methods=["GET", "POST"])
@firebase_auth
def manage_embeds():
    if request.method == "GET":
        docs = db.collection("embeds").get()
        return jsonify(
            [
                {
                    "id": doc.id,
                    "title": doc.get("title"),
                    "code": doc.get("code"),
                    "formatted_code": format_code(doc),
                    "created": doc.get("created"),
                    "extra_param_1_default": doc.get("extra_param_1_default"),
                    "extra_param_2_default": doc.get("extra_param_2_default"),
                }
                for doc in docs
            ]
        )

    if request.method == "POST":
        data = request.json
        new_doc = db.collection("embeds").document()
        new_doc.set(
            {
                "title": data.get("title", "Untitled"),
                "code": data["code"],
                "created": firestore.SERVER_TIMESTAMP,
                "extra_param_1_default": data.get("extra_param_1_default", None),
                "extra_param_2_default": data.get("extra_param_2_default", None),
            }
        )
        return jsonify({"id": new_doc.id}), 201


@app.route("/api/embeds/<embed_id>", methods=["PUT", "DELETE"])
@firebase_auth
def single_embed(embed_id):
    doc_ref = db.collection("embeds").document(embed_id)
    if request.method == "PUT":
        data = request.json
        update_data = {
            "title": data.get("title"),
            "code": data.get("code"),
            "modified": firestore.SERVER_TIMESTAMP,
            "extra_param_1_default": data.get("extra_param_1_default", None),
            "extra_param_2_default": data.get("extra_param_2_default", None),
        }
        doc_ref.update({k: v for k, v in update_data.items() if v is not None})
        return jsonify({"status": "updated"})
    elif request.method == "DELETE":
        doc_ref.delete()
        return jsonify({"status": "deleted"})

@app.route("/api/embeds/add_field/<field_name>", methods=["GET"])
@firebase_auth
def add_field_to_embeds(field_name: str):
    docs = db.collection("embeds").get()
    for doc in docs:
        doc.reference.update({
            field_name: ""
        })
    return jsonify({"status": "updated"})    
    


if __name__ == "__main__":
    app.run(ssl_context="adhoc", port=5000)

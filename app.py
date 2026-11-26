import os
import json
import uuid
from datetime import datetime

import cv2
import imutils
import numpy as np



from flask import (
    Flask,
    request,
    render_template,
    redirect,
    url_for,
    session,
    jsonify,
    send_from_directory
)

from werkzeug.utils import secure_filename

from tensorflow.keras.models import Model
from tensorflow.keras.layers import Flatten, Dense, Dropout
from tensorflow.keras.applications.vgg19 import VGG19

from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime

from werkzeug.security import generate_password_hash, check_password_hash


# ============================================================
# AAROGYADRISHTI - FLASK CONFIGURATION
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)
app.secret_key = "aarogyadrishti_ai_secret_2026"

try:
    MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/")
    mongo_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    mongo_client.server_info()  # Connection test
    db = mongo_client["aarogyadrishti_db"]
    history_collection = db["history"]
    users_collection = db["users"]
    print("MONGODB STATUS : CONNECTED")
except Exception as e:
    history_collection = None
    users_collection = None
    print(f"MONGODB STATUS : DISCONNECTED ({e})")


# ============================================================
# FOLDERS
# ============================================================

UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
MODEL_FOLDER = os.path.join(BASE_DIR, "model")
DATA_FOLDER = os.path.join(BASE_DIR, "data")

HISTORY_FILE = os.path.join(DATA_FOLDER, "history.json")
FEEDBACK_FILE = os.path.join(DATA_FOLDER, "feedback.json")

MODEL_PATH = os.path.join(
    MODEL_FOLDER,
    "vgg19_model_03.weights.h5"
)

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(MODEL_FOLDER, exist_ok=True)
os.makedirs(DATA_FOLDER, exist_ok=True)


# ============================================================
# FLASK SETTINGS
# ============================================================

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024


# ============================================================
# ALLOWED FILE TYPES
# ============================================================

ALLOWED_EXTENSIONS = {
    "jpg",
    "jpeg",
    "png",
    "webp"
}


# ============================================================
# IMAGE SIZE
# ============================================================

IMAGE_SIZE = (240, 240)


# ============================================================
# CLASS MAPPING
# ============================================================

CLASS_NAMES = {
    0: "No Brain Tumor",
    1: "Yes Brain Tumor"
}


# ============================================================
# HISTORY FILE INITIALIZATION
# ============================================================

if not os.path.exists(HISTORY_FILE):

    with open(
        HISTORY_FILE,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            [],
            file,
            indent=4
        )


# ============================================================
# FEEDBACK FILE INITIALIZATION
# ============================================================

if not os.path.exists(FEEDBACK_FILE):

    with open(
        FEEDBACK_FILE,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            [],
            file,
            indent=4,
            ensure_ascii=False
        )


# ============================================================
# BUILD EXACT MODEL 03 ARCHITECTURE
# ============================================================

print()
print("=" * 70)
print("        AAROGYADRISHTI - MODEL INITIALIZATION")
print("=" * 70)
print()

MODEL_LOADED = False
model_03 = None


try:

    print("Building VGG19 Model 03...")

    base_model = VGG19(
        input_shape=(240, 240, 3),
        include_top=False,
        weights="imagenet"
    )

    x = base_model.output

    flat = Flatten()(x)

    class_1 = Dense(
        4608,
        activation="relu"
    )(flat)

    drop_out = Dropout(
        0.2
    )(class_1)

    class_2 = Dense(
        1152,
        activation="relu"
    )(drop_out)

    output = Dense(
        2,
        activation="softmax"
    )(class_2)

    model_03 = Model(
        base_model.input,
        output
    )

    for layer in base_model.layers:
        layer.trainable = True

    print("Architecture created.")
    print("Loading Model 03 weights...")

    if not os.path.exists(MODEL_PATH):

        raise FileNotFoundError(
            "Model weights not found:\n"
            + MODEL_PATH
            + "\n\n"
            "Put vgg19_model_03.weights.h5 inside the model folder."
        )

    model_03.load_weights(
        MODEL_PATH
    )

    MODEL_LOADED = True

    print()
    print("MODEL LOADED SUCCESSFULLY")
    print("-" * 70)
    print("Model input shape :", model_03.input_shape)
    print("Model output shape:", model_03.output_shape)
    print("Weights           :", MODEL_PATH)
    print("Classes           :", CLASS_NAMES)
    print("-" * 70)

except Exception as error:

    MODEL_LOADED = False

    print()
    print("MODEL LOADING ERROR")
    print("-" * 70)
    print(error)
    print("-" * 70)


print()


# ============================================================
# UTILITY FUNCTIONS
# ============================================================

def allowed_file(filename):

    return (
        "." in filename
        and
        filename.rsplit(".", 1)[1].lower()
        in ALLOWED_EXTENSIONS
    )


# ============================================================
# CLASS NAME
# ============================================================

def get_className(classNo):

    classNo = int(classNo)

    if classNo == 0:
        return "No Brain Tumor"

    if classNo == 1:
        return "Yes Brain Tumor"

    return "Unknown"


# ============================================================
# BRAIN CROPPING
# ============================================================

def crop_brain_tumor(image):

    if image is None:
        raise ValueError("Invalid image.")

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    gray = cv2.GaussianBlur(
        gray,
        (5, 5),
        0
    )

    thres = cv2.threshold(
        gray,
        45,
        255,
        cv2.THRESH_BINARY
    )[1]

    thres = cv2.erode(
        thres,
        None,
        iterations=2
    )

    thres = cv2.dilate(
        thres,
        None,
        iterations=2
    )

    cnts = cv2.findContours(
        thres.copy(),
        cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE
    )

    cnts = imutils.grab_contours(cnts)

    if not cnts:
        return image

    c = max(
        cnts,
        key=cv2.contourArea
    )

    extLeft = tuple(
        c[c[:, :, 0].argmin()][0]
    )

    extRight = tuple(
        c[c[:, :, 0].argmax()][0]
    )

    extTop = tuple(
        c[c[:, :, 1].argmin()][0]
    )

    extBot = tuple(
        c[c[:, :, 1].argmax()][0]
    )

    x1 = max(
        0,
        extLeft[0]
    )

    x2 = min(
        image.shape[1],
        extRight[0]
    )

    y1 = max(
        0,
        extTop[1]
    )

    y2 = min(
        image.shape[0],
        extBot[1]
    )

    if x2 <= x1 or y2 <= y1:
        return image

    cropped = image[
        y1:y2,
        x1:x2
    ]

    if cropped.size == 0:
        return image

    return cropped


# ============================================================
# PREDICTION FUNCTION
# ============================================================

def getResult(img_path):

    if not MODEL_LOADED:

        raise RuntimeError(
            "Model is not loaded."
        )

    image = cv2.imread(
        img_path
    )

    if image is None:

        raise ValueError(
            "Unable to read uploaded image."
        )

    image = crop_brain_tumor(
        image
    )

    image = cv2.resize(
        image,
        IMAGE_SIZE,
        interpolation=cv2.INTER_CUBIC
    )

    image = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2RGB
    )

    image = image.astype(
        np.float32
    ) / 255.0

    input_img = np.expand_dims(
        image,
        axis=0
    )

    result = model_03.predict(
        input_img,
        verbose=0
    )

    probabilities = result[0]

    predicted_class = int(
        np.argmax(
            probabilities
        )
    )

    confidence = float(
        probabilities[predicted_class] * 100
    )

    no_tumor_confidence = float(
        probabilities[0] * 100
    )

    tumor_confidence = float(
        probabilities[1] * 100
    )

    prediction_result = {

        "class_no":
            predicted_class,

        "class_name":
            get_className(
                predicted_class
            ),

        "confidence":
            round(
                confidence,
                2
            ),

        "probabilities":
            [
                round(
                    no_tumor_confidence,
                    2
                ),
                round(
                    tumor_confidence,
                    2
                )
            ],

        "no_tumor_confidence":
            round(
                no_tumor_confidence,
                2
            ),

        "tumor_confidence":
            round(
                tumor_confidence,
                2
            )
    }

    print()
    print("=" * 60)
    print("AAROGYADRISHTI AI PREDICTION")
    print("=" * 60)

    print(
        "No Tumor probability :",
        round(
            no_tumor_confidence,
            2
        ),
        "%"
    )

    print(
        "Tumor probability    :",
        round(
            tumor_confidence,
            2
        ),
        "%"
    )

    print(
        "Predicted class      :",
        predicted_class
    )

    print(
        "Prediction           :",
        get_className(
            predicted_class
        )
    )

    print(
        "Confidence           :",
        round(
            confidence,
            2
        ),
        "%"
    )

    print("=" * 60)
    print()

    return prediction_result


# ============================================================
# HISTORY FUNCTIONS
# ============================================================

def load_history():

    if history_collection is not None:
        try:
            records = []
            for doc in history_collection.find().sort("created_at", -1).limit(100):
                doc["_id"] = str(doc["_id"])
                if "created_at" in doc and isinstance(doc["created_at"], datetime):
                    doc["created_at"] = doc["created_at"].isoformat()
                records.append(doc)
            return records
        except Exception as e:
            print(f"MongoDB Load History Error: {e}")

    try:
        with open(HISTORY_FILE, "r", encoding="utf-8") as file:
            data = json.load(file)
            if isinstance(data, list):
                return data
            return []
    except Exception:
        return []

def save_history(history):

    with open(
        HISTORY_FILE,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            history,
            file,
            indent=4,
            ensure_ascii=False
        )


# ============================================================
# FEEDBACK FUNCTIONS
# ============================================================

def load_feedback():

    try:

        with open(
            FEEDBACK_FILE,
            "r",
            encoding="utf-8"
        ) as file:

            data = json.load(
                file
            )

            if isinstance(data, list):
                return data

            return []

    except Exception:

        return []


def save_feedback(feedback_data):

    with open(
        FEEDBACK_FILE,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            feedback_data,
            file,
            indent=4,
            ensure_ascii=False
        )


# ============================================================
# REPORT ID
# ============================================================

def generate_report_id():

    return (
        "AD-"
        +
        datetime.now().strftime(
            "%Y%m%d"
        )
        +
        "-"
        +
        uuid.uuid4().hex[:6].upper()
    )


# ============================================================
# HOME PAGE
# ============================================================

@app.route("/")
def home():

    return render_template(
        "index.html"
    )


# ============================================================
# PREDICTION PAGE
# ============================================================

@app.route(
    "/predict",
    methods=["GET", "POST"]
)
def predict():
    if not session.get("user"):
        return redirect(url_for("home"))

    if request.method == "GET":

        return render_template(
            "predict.html"
        )

    if not MODEL_LOADED:

        return render_template(
            "predict.html",
            error=(
                "AI model could not be loaded. "
                "Please check "
                "model/vgg19_model_03.weights.h5."
            )
        )

    if "file" not in request.files:

        return render_template(
            "predict.html",
            error="Please upload an MRI image."
        )

    file = request.files["file"]

    if file.filename == "":

        return render_template(
            "predict.html",
            error="Please select an MRI image."
        )

    if not allowed_file(
        file.filename
    ):

        return render_template(
            "predict.html",
            error=(
                "Only JPG, JPEG, PNG and WEBP "
                "images are supported."
            )
        )

    patient_name = request.form.get(
        "patient_name",
        "Patient"
    ).strip()

    patient_age = request.form.get(
        "patient_age",
        "--"
    ).strip()

    patient_gender = request.form.get(
        "patient_gender",
        "--"
    ).strip()

    if not patient_name:
        patient_name = "Patient"

    original_filename = secure_filename(
        file.filename
    )

    extension = os.path.splitext(
        original_filename
    )[1].lower()

    unique_filename = (
        datetime.now().strftime(
            "%Y%m%d_%H%M%S"
        )
        +
        "_"
        +
        uuid.uuid4().hex[:8]
        +
        extension
    )

    file_path = os.path.join(
        UPLOAD_FOLDER,
        unique_filename
    )

    file.save(
        file_path
    )

    try:

        prediction_result = getResult(
            file_path
        )

    except Exception as error:

        print()
        print("Prediction Error:")
        print(error)
        print()

        try:

            if os.path.exists(
                file_path
            ):

                os.remove(
                    file_path
                )

        except Exception:
            pass

        return render_template(
            "predict.html",
            error=(
                "Prediction failed. "
                "Please try another MRI image."
            )
        )

    now = datetime.now()

    report_id = generate_report_id()

    report_date = now.strftime(
        "%d %B %Y"
    )

    report_time = now.strftime(
        "%I:%M %p"
    )

    prediction = prediction_result[
        "class_name"
    ]

    confidence = prediction_result[
        "confidence"
    ]

    probabilities = prediction_result[
        "probabilities"
    ]

    report_data = {

        "patient_name":
            patient_name,

        "patient_age":
            patient_age,

        "patient_gender":
            patient_gender,

        "prediction":
            prediction,

        "class_no":
            prediction_result[
                "class_no"
            ],

        "confidence":
            confidence,

        "no_tumor_confidence":
            probabilities[0],

        "tumor_confidence":
            probabilities[1],

        "report_id":
            report_id,

        "report_date":
            report_date,

        "report_time":
            report_time,

        "image_filename":
            unique_filename,

        "original_filename":
            original_filename
    }

    session["report"] = report_data

    history = load_history()

    history_record = {

        "id":
            report_id,

        "patient_name":
            patient_name,

        "patient_age":
            patient_age,

        "patient_gender":
            patient_gender,

        "prediction":
            prediction,

        "class_no":
            prediction_result[
                "class_no"
            ],

        "confidence":
            confidence,

        "no_tumor_confidence":
            probabilities[0],

        "tumor_confidence":
            probabilities[1],

        "date":
            report_date,

        "time":
            report_time,

        "image":
            unique_filename
    }

    # Save to MongoDB
    if history_collection is not None:
        try:
            mongo_record = dict(history_record)
            mongo_record["created_at"] = datetime.now()
            history_collection.insert_one(mongo_record)
        except Exception as e:
            print(f"MongoDB Insert History Error: {e}")

    history.insert(
        0,
        history_record
    )

    history = history[:100]

    save_history(
        history
    )

    return redirect(
        url_for(
            "report"
        )
    )


# ============================================================
# REPORT PAGE
# ============================================================

@app.route("/report")
def report():

    report_data = session.get(
        "report"
    )

    if not report_data:

        return redirect(
            url_for(
                "predict"
            )
        )

    image_filename = report_data.get(
        "image_filename"
    )

    image_url = None

    if image_filename:

        image_url = url_for(
            "uploaded_file",
            filename=image_filename
        )

    return render_template(
        "report.html",

        patient_name=
            report_data.get(
                "patient_name",
                "Patient"
            ),

        patient_age=
            report_data.get(
                "patient_age",
                "--"
            ),

        patient_gender=
            report_data.get(
                "patient_gender",
                "--"
            ),

        prediction=
            report_data.get(
                "prediction",
                "No Brain Tumor"
            ),

        confidence=
            report_data.get(
                "confidence",
                0
            ),

        report_id=
            report_data.get(
                "report_id",
                "AD-000000"
            ),

        report_date=
            report_data.get(
                "report_date",
                "--"
            ),

        report_time=
            report_data.get(
                "report_time",
                "--"
            ),

        image=
            image_url,

        image_path=None
    )

# ============================================================
# REPORT PAGE
# ============================================================


# ============================================================
# UPLOADED IMAGE ROUTE
# ============================================================

@app.route(
    "/uploads/<filename>"
)
def uploaded_file(filename):

    return send_from_directory(
        UPLOAD_FOLDER,
        filename
    )


# ============================================================
# HISTORY PAGE
# ============================================================

@app.route("/history")
def history():
    if not session.get("user"):
        return redirect(url_for("home"))

    history_data = load_history()

    return render_template(
        "history.html",
        history=history_data
    )


# ============================================================
# HISTORY API
# ============================================================

@app.route(
    "/api/history",
    methods=["GET"]
)
def history_api():

    return jsonify(
        load_history()
    )


# ============================================================
# CLEAR HISTORY API
# ============================================================

@app.route(
    "/api/history/clear",
    methods=["POST"]
)
def clear_history():


    if history_collection is not None:
        history_collection.delete_many({})

    save_history([])

    return jsonify({
        "success": True,
        "message": "History cleared successfully."
    })


# ============================================================
# ABOUT PAGE
# ============================================================

@app.route("/about")
def about():

    return render_template(
        "about.html"
    )


# ============================================================
# USER AUTHENTICATION (POPUP MODAL APIs)
# ============================================================

@app.context_processor
def inject_user():
    return dict(current_user=session.get("user"))


@app.route("/api/register", methods=["POST"])
def api_register():
    if users_collection is None:
        return jsonify({"success": False, "message": "Database connected nahi hai."}), 500

    data = request.get_json() or {}
    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not name or not email or not password:
        return jsonify({"success": False, "message": "Saari fields bharna zaroori hai."}), 400

    if len(password) < 6:
        return jsonify({"success": False, "message": "Password kam se kam 6 characters ka hona chahiye."}), 400

    if users_collection.find_one({"email": email}):
        return jsonify({"success": False, "message": "Ye email pehle se registered hai."}), 409

    user_doc = {
        "name": name,
        "email": email,
        "password": generate_password_hash(password),
        "created_at": datetime.now()
    }
    users_collection.insert_one(user_doc)

    session["user"] = {"name": name, "email": email}
    return jsonify({"success": True, "message": "Account ban gaya!", "user": session["user"]})


@app.route("/api/login", methods=["POST"])
def api_login():
    if users_collection is None:
        return jsonify({"success": False, "message": "Database connected nahi hai."}), 500

    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"success": False, "message": "Email aur password dono daalein."}), 400

    user = users_collection.find_one({"email": email})
    if not user or not check_password_hash(user["password"], password):
        return jsonify({"success": False, "message": "Galat email ya password."}), 401

    session["user"] = {"name": user["name"], "email": user["email"]}
    return jsonify({"success": True, "message": "Login successful!", "user": session["user"]})


@app.route("/api/logout", methods=["POST"])
def api_logout():
    session.pop("user", None)
    return jsonify({"success": True, "message": "Logged out successfully."})



# ============================================================
# FEEDBACK PAGE
#
# GET  -> Show feedback form
# POST -> Save feedback
# ============================================================

@app.route(
    "/feedback",
    methods=["GET", "POST"]
)
def feedback():

    # --------------------------------------------------------
    # GET REQUEST
    # --------------------------------------------------------

    if request.method == "GET":

        return render_template(
            "feedback.html"
        )


    # --------------------------------------------------------
    # GET FORM DATA
    # --------------------------------------------------------

    name = request.form.get(
        "name",
        ""
    ).strip()

    email = request.form.get(
        "email",
        ""
    ).strip()

    phone = request.form.get(
        "phone",
        ""
    ).strip()

    rating = request.form.get(
        "rating",
        ""
    ).strip()

    category = request.form.get(
        "category",
        ""
    ).strip()

    feedback_text = request.form.get(
        "feedback",
        ""
    ).strip()

    recommendation = request.form.get(
        "recommendation",
        ""
    ).strip()

    improvement = request.form.get(
        "improvement",
        ""
    ).strip()

    liked = request.form.getlist(
        "liked"
    )


    # --------------------------------------------------------
    # VALIDATION
    # --------------------------------------------------------

    if not name:

        return render_template(
            "feedback.html",
            error="Please enter your name."
        )


    if not email:

        return render_template(
            "feedback.html",
            error="Please enter your email."
        )


    if not rating:

        return render_template(
            "feedback.html",
            error="Please select a rating."
        )


    if not category:

        return render_template(
            "feedback.html",
            error="Please select a feedback category."
        )


    if not feedback_text:

        return render_template(
            "feedback.html",
            error="Please write your feedback."
        )


    if not recommendation:

        return render_template(
            "feedback.html",
            error="Please select your recommendation."
        )


    # --------------------------------------------------------
    # CREATE FEEDBACK RECORD
    # --------------------------------------------------------

    feedback_record = {

        "id":
            "FB-"
            +
            uuid.uuid4().hex[:8].upper(),

        "name":
            name,

        "email":
            email,

        "phone":
            phone,

        "rating":
            rating,

        "category":
            category,

        "feedback":
            feedback_text,

        "recommendation":
            recommendation,

        "liked":
            liked,

        "improvement":
            improvement,

        "date":
            datetime.now().strftime(
                "%d %B %Y"
            ),

        "time":
            datetime.now().strftime(
                "%I:%M %p"
            )
    }


    # --------------------------------------------------------
    # LOAD EXISTING FEEDBACK
    # --------------------------------------------------------

    feedback_data = load_feedback()


    # --------------------------------------------------------
    # ADD NEW FEEDBACK
    # --------------------------------------------------------

    feedback_data.insert(
        0,
        feedback_record
    )


    # --------------------------------------------------------
    # KEEP LATEST 500 FEEDBACKS
    # --------------------------------------------------------

    feedback_data = feedback_data[:500]


    # --------------------------------------------------------
    # SAVE FEEDBACK
    # --------------------------------------------------------

    save_feedback(
        feedback_data
    )


    # --------------------------------------------------------
    # SHOW SUCCESS MESSAGE
    # --------------------------------------------------------

    return render_template(
        "feedback.html",
        success=(
            "Thank you for your valuable feedback! "
            "Your response has been submitted successfully."
        )
    )


# ============================================================
# FEEDBACK API
# ============================================================

@app.route(
    "/api/feedback",
    methods=["GET"]
)
def feedback_api():

    feedback_data = load_feedback()

    return jsonify({
        "success": True,
        "count": len(feedback_data),
        "feedback": feedback_data
    })


# ============================================================
# CURRENT REPORT API
# ============================================================

@app.route(
    "/api/current-report"
)
def current_report():

    report_data = session.get(
        "report"
    )

    if not report_data:

        return jsonify({
            "success": False,
            "message": "No report available."
        }), 404

    return jsonify({
        "success": True,
        "report": report_data
    })


# ============================================================
# MODEL STATUS API
# ============================================================

@app.route(
    "/api/model-status"
)
def model_status():

    return jsonify({

        "model":
            "VGG19 Model 03",

        "loaded":
            MODEL_LOADED,

        "input_shape":
            "240x240x3",

        "output_shape":
            "2",

        "classes":
            {
                "0": "No Brain Tumor",
                "1": "Yes Brain Tumor"
            },

        "weights":
            "model/vgg19_model_03.weights.h5",

        "preprocessing":
            [
                "Brain crop",
                "Resize 240x240",
                "RGB conversion",
                "Normalize /255"
            ]
    })


# ============================================================
# HEALTH CHECK API
# ============================================================

@app.route(
    "/api/health"
)
def health():

    return jsonify({
        "success": True,
        "application": "AarogyaDrishti",
        "model_loaded": MODEL_LOADED,
        "status": "running"
    })


# ============================================================
# ERROR HANDLERS
# ============================================================

@app.errorhandler(413)
def file_too_large(error):

    return render_template(
        "predict.html",
        error=(
            "File is too large. "
            "Maximum size is 10 MB."
        )
    ), 413


@app.errorhandler(404)
def page_not_found(error):

    return render_template(
        "index.html"
    ), 404


@app.errorhandler(500)
def internal_server_error(error):

    return render_template(
        "index.html"
    ), 500


# ============================================================
# START FLASK
# ============================================================

if __name__ == "__main__":

    print()
    print("=" * 70)
    print("              AAROGYADRISHTI")
    print("          MEDICAL AI SYSTEM")
    print("=" * 70)
    print()

    if MODEL_LOADED:

        print("MODEL STATUS : READY")
        print("MODEL        : VGG19 Model 03")
        print("INPUT        : 240 x 240 x 3")

        print(
            "ARCHITECTURE : "
            "VGG19 + Flatten + Dense(4608) "
            "+ Dropout + Dense(1152) + Dense(2)"
        )

        print(
            "CLASSES      : 0=Nontumorous, 1=Tumorous"
        )

        print()

    else:

        print("MODEL STATUS : ERROR")

        print(
            "Check:",
            MODEL_PATH
        )

        print()

    print(
        "Open: http://127.0.0.1:5000/"
    )

    print()
    print("=" * 70)
    print()

    port = int(os.environ.get("PORT", 7860))
    app.run(host="0.0.0.0", port=port, debug=False)
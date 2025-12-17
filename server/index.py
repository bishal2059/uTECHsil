from ultralytics import YOLO
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import uuid
import cv2
import random
import os
import io
import base64

app = Flask(__name__)
CORS(app)

# Ensure temp directory exists
os.makedirs('/tmp/utechsil', exist_ok=True)

model = YOLO("./model.pt")
colors = [[random.randint(0, 255) for _ in range(3)] for _ in range(24)]


@app.route("/api/image", methods=["POST"])
def predictImage():
    """Handle image detection - supports both file upload and base64"""
    try:
        image = None
        
        # Check if file is in request
        if 'img' in request.files:
            image = request.files["img"]
        elif 'image' in request.files:
            image = request.files["image"]
        
        if image is None:
            return jsonify({"message": "No image received", "frame": []}), 400

        # Read image
        img = Image.open(image)
        
        result = model([img], conf=0.6)[0]

        data = result.boxes.data.cpu().tolist()
        h, w = result.orig_shape

        names = result.names

        r = []
        for row in data:
            box = [row[0] / w, row[1] / h, row[2] / w, row[3] / h]
            conf = row[4]
            classId = int(row[5])
            name = names[classId]
            r.append(
                {
                    "box": box,
                    "confidence": conf,
                    "classId": classId,
                    "name": name,
                    "color": "#%02x%02x%02x" % tuple(colors[classId % len(colors)]),
                }
            )

        return jsonify({"frame": r})
    
    except Exception as e:
        print(f"Error in predictImage: {e}")
        return jsonify({"message": str(e), "frame": []}), 500


@app.route("/api/video", methods=["POST"])
def predictVideo():
    """Handle video file detection"""
    try:
        video = request.files.get("video")

        if video is None:
            return jsonify({"message": "No video received"}), 400
        
        # Save video temporarily
        name = f"/tmp/utechsil/{uuid.uuid4()}.mp4"
        video.save(name)

        # Process video
        predicted = model(name, stream=True, conf=0.6)

        cap = cv2.VideoCapture(name)
        fps = cap.get(cv2.CAP_PROP_FPS)
        cap.release()

        frames = []
        uniqueClasses = {}
        
        for result in predicted:
            frameResult = []
            
            data = result.boxes.data.cpu().tolist()
            h, w = result.orig_shape
            names = result.names

            for row in data:
                box = [row[0] / w, row[1] / h, row[2] / w, row[3] / h]
                conf = row[4]
                classId = int(row[5])
                name = names[classId]
                frameResult.append(
                    {
                        "box": box,
                        "confidence": conf,
                        "classId": classId,
                        "name": name,
                        "color": "#%02x%02x%02x" % tuple(colors[classId % len(colors)]),
                    }
                )
                uniqueClasses[classId] = name

            frames.append(frameResult)

        # Clean up temp file
        try:
            os.remove(name)
        except:
            pass

        totalDetectedDistinctClasses = [[k, v] for k, v in uniqueClasses.items()]
        
        print(f"Total frames: {len(frames)}, Total Classes: {len(totalDetectedDistinctClasses)}")
        
        return jsonify({
            "frames": frames,
            "classes": totalDetectedDistinctClasses,
            "fps": fps,
        })
        
    except Exception as e:
        print(f"Error in predictVideo: {e}")
        return jsonify({"message": str(e)}), 500


@app.route("/api/frame", methods=["POST"])
def predictFrame():
    """Handle single frame detection for live video streaming"""
    try:
        # Accept base64 encoded frame
        data = request.get_json()
        
        if data and 'frame' in data:
            # Decode base64 image
            frame_data = data['frame'].split(',')[1] if ',' in data['frame'] else data['frame']
            frame_bytes = base64.b64decode(frame_data)
            img = Image.open(io.BytesIO(frame_bytes))
        elif 'img' in request.files:
            img = Image.open(request.files['img'])
        else:
            return jsonify({"message": "No frame received", "detections": []}), 400

        result = model([img], conf=0.6)[0]

        data = result.boxes.data.cpu().tolist()
        h, w = result.orig_shape
        names = result.names

        detections = []
        for row in data:
            box = [row[0] / w, row[1] / h, row[2] / w, row[3] / h]
            conf = row[4]
            classId = int(row[5])
            name = names[classId]
            detections.append(
                {
                    "box": box,
                    "confidence": conf,
                    "classId": classId,
                    "name": name,
                    "color": "#%02x%02x%02x" % tuple(colors[classId % len(colors)]),
                }
            )

        return jsonify({"detections": detections})
    
    except Exception as e:
        print(f"Error in predictFrame: {e}")
        return jsonify({"message": str(e), "detections": []}), 500


@app.route("/api/health", methods=["GET"])
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "model": "loaded"})


@app.route("/")
def home():
    return jsonify({"message": "uTECHsil API - Traditional Object Detection"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000, debug=True)

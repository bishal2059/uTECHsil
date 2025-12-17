# 🏺 uTECHsil - Traditional Object Detection

<div align="center">

![uTECHsil](https://img.shields.io/badge/uTECHsil-AI%20Powered-6366f1?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.8+-3776ab?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-18.2-61dafb?style=for-the-badge&logo=react&logoColor=white)
![YOLOv8](https://img.shields.io/badge/YOLOv8-Ultralytics-00ff00?style=for-the-badge)

**When technology meets tradition, we unlock the secrets of the past**

*AI-powered detection and identification of traditional Nepali utensils*

</div>

---

## ✨ Features

- 🖼️ **Image Detection** - Upload images to identify traditional utensils
- 📹 **Video Detection** - Process video files with frame-by-frame analysis
- 📷 **Live Webcam** - Real-time object detection using your camera
- 📚 **Rich Information** - Detailed descriptions, uses, and cultural significance
- 🎨 **Modern UI** - Beautiful glassmorphic dark theme with smooth animations

---

## 📁 Project Structure

```
uTECHsil/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components (Home, Image, Video, Tools)
│   │   └── data/           # Tools information data
│   └── package.json
├── server/                 # Flask backend
│   ├── index.py            # Main API server
│   ├── model.pt            # YOLOv8 trained model (you need to add this)
│   └── requirements.txt
├── model/                  # Model training resources
│   └── training.ipynb      # Jupyter notebook for training
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Python** 3.8 or higher
- **Node.js** 18 or higher
- **npm** or **yarn**
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/uTECHsil.git
cd uTECHsil
```

### 2. Download the Model & Dataset

📦 **[Download from Google Drive](https://drive.google.com/drive/folders/1Ik_O5GubUF5o8Rmdfpotc3AKwBk2sOI3?usp=sharing)**

The drive contains two main folders:

| Folder | Contents |
|--------|----------|
| `unlabelled_dataset/` | Raw images for annotation and training |
| `uTECHsil_model/` | Pre-trained models and resources |

**Inside `uTECHsil_model/`:**

```
uTECHsil_model/
├── best_model/          # Best trained model files
│   └── best.pt          # ⬅️ Copy this as model.pt to server/
├── model_training/      # Training code with labelled dataset
│   └── (training notebooks & labelled data)
└── samples/             # Sample images and videos for testing
```

### 3. Setup the Server (Backend)

```bash
# Navigate to server directory
cd server

# Create a virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
.\venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Copy the model file (from downloaded drive)
# Copy best.pt from uTECHsil_model/best_model/ and rename to model.pt
cp /path/to/uTECHsil_model/best_model/best.pt ./model.pt

# Start the Flask server
python index.py
```

The server will start at `http://localhost:3000`

### 4. Setup the Client (Frontend)

Open a **new terminal** window:

```bash
# Navigate to client directory
cd client

# Install Node.js dependencies
npm install

# Start the development server
npm run dev
```

The client will start at `http://localhost:5173`

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 🔧 Configuration

### Environment Variables (Optional)

Create a `.env` file in the `client/` directory:

```env
VITE_HOST=localhost
VITE_PORT=5173
VITE_BACKEND_HOST=localhost
VITE_BACKEND_PORT=3000
```

---

## 🧠 Training Your Own Model

### Using the Provided Jupyter Notebook

1. Open `model/training.ipynb` in Jupyter Notebook or VS Code
2. Follow the cells to train your custom YOLOv8 model
3. The trained model will be saved as `best.pt`

### Annotating New Data

1. Use [CVAT.ai](https://www.cvat.ai/) to annotate images
2. Export annotations in YOLO format
3. Update the dataset path in the training notebook
4. Run the training cells

### Dataset Structure for Training

```
dataset/
├── train/
│   ├── images/
│   └── labels/
├── valid/
│   ├── images/
│   └── labels/
└── data.yaml
```

---

## 🛠️ API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/image` | Detect objects in an uploaded image |
| `POST` | `/api/video` | Process a video file for detection |
| `POST` | `/api/frame` | Detect objects in a single frame (base64) |
| `GET` | `/api/health` | Health check endpoint |
| `GET` | `/` | API welcome message |

### Example: Image Detection

```bash
curl -X POST http://localhost:3000/api/image \
  -F "img=@/path/to/your/image.jpg"
```

---

## 📱 Usage Guide

### Image Detection
1. Click on **"Image"** in the navigation
2. Upload an image or drag & drop
3. Click **"Detect"** to identify objects
4. Click on detected items for more information

### Video Detection
1. Click on **"Video"** in the navigation
2. Choose **"Live Webcam"** or **"Upload Video"**
3. For webcam: Click **"Start Detection"**
4. For video: Click **"Analyze Video"** and wait for processing
5. Play the video with detection overlays

### Tools Encyclopedia
1. Click on **"Info"** in the navigation
2. Browse all traditional tools
3. Click on any tool for detailed information

---

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI Library
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **React Icons** - Icons

### Backend
- **Flask** - Web Framework
- **Flask-CORS** - Cross-Origin Resource Sharing
- **Ultralytics YOLOv8** - Object Detection Model
- **OpenCV** - Image/Video Processing
- **Pillow** - Image Handling

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🙏 Acknowledgments

- **[Ultralytics](https://ultralytics.com/)** - For the amazing YOLOv8 model
- **[CVAT.ai](https://www.cvat.ai/)** - For the annotation tool
- **Traditional Nepali Heritage** - For inspiring this project

---

<div align="center">

**Made with ❤️ for preserving traditional heritage**

</div>


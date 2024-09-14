## To run this object detection application you need the model.pt file which is obtained by custom training from your data using the YOLOv8 model

# Steps to run it locally:

1. Save the model file (as model.pt) and keep it in the server folder.
2. Modify the client folder as per your object detection application.

To start the flask server:

```
pip install -r requirements.txt

python index.py
```

To start the client development mode:

```
npm install

npm run dev
```
### Sample model file with two detectable classes is given in the following link:
https://drive.google.com/drive/folders/1_DFv_K8bghfEVjnnuICNPj1x4FwVZ_DJ?usp=sharing

(The jupyter notebook to train the model is also provided in the above link)

### To develop your own model use the images provided in the following link:
https://drive.google.com/drive/folders/10dp0IubDLPfDTqumu7kdLCrd0GeRbmjt?usp=sharing

(Also use,https://www.cvat.ai/ to annotate the given images)

Note: It uses YOLOv8 model and would like to thanks ultralytics for providing such a great model in order for us to use in our object detection application.
This application is inspired by other projects related to object detection.

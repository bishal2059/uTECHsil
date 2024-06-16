## To run this object detection application you need the model.pt file which is obtained by custom training from your data using the YOLOv8 model

# Steps to run it locally:

1. Set the model file and keep it in the server folder.
2. Modify the client folder as per your object detection application

To start the flask server:

```
python index.py
```

To start the client development mode:

```
npm run dev
```

Note: It uses YOLOv8 model and would like to thanks ultralytics for providing such a great model in order for us to use in our object detection application.
This application is inspired by other projects related to object detection.

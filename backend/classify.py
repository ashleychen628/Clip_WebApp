from flask import Flask, flash, request, redirect, make_response, url_for, session, jsonify
from flask_cors import CORS
from collections import OrderedDict
from werkzeug.utils import secure_filename
from clip import Clip
import glob
import os
import logging
import json
import shutil

app = Flask(__name__)
CORS(app, resources={"/*": {"origin": "http://localhost:3000"}})

UPLOAD_FOLDER = '../clip/src/uploaded_Images/'
RESULT_IMAGE_PATH = "../clip/src/result_Images/"
ALLOWED_IMG_EXTENSIONS = {'png', 'jpg'}

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('HELLO WORLD')
descriptions = []
setNameList = []

@app.route("/getSetNames", methods=["GET"])
def getSetNames():
    """Return a list of setNames."""

    getSetNames = []
    if os.path.isfile('files/descriptionSet.json'):
        getSetNames = list(json.load(open('files/descriptionSet.json')).keys())

    return {"setNameList": getSetNames}

@app.route("/deleteSet", methods=["POST"])
def deleteSet():
    """Delete a specific set"""

    setName = request.get_json()['setName']

    FILE_PATH = 'files/descriptionSet.json'
    with open(FILE_PATH) as outfile:
        output = json.load(outfile)
    
    del output[setName]

    with open(FILE_PATH, mode='w') as outfile:
        outfile.write(json.dumps(output, indent=2))
    
    return {"status": "deleted set"}

@app.route("/getSet/<setName>", methods=["GET"])
def getSet(setName):
    """Return the corresponding descriptions of setName."""
    
    FILE_PATH = 'files/descriptionSet.json'
    with open(FILE_PATH) as outfile:
        output = json.load(outfile)[setName]["descriptions"]
    # print(output)
    return{"descriptions": output}
    

    

@app.route("/uploadImage", methods=["POST"])
def uploadImage():
    """Save Images to the target path."""
    target=os.path.join(UPLOAD_FOLDER,'calc_probabilities')

    if not os.path.isdir(target):
        os.mkdir(target)

    logger.info("welcome to upload`")

    files = request.files.getlist('files[]')

    filenames = []
    for f in files:
        filename = secure_filename(f.filename)
        dest="/".join([target, filename])
        f.save(dest)
        filenames.append(filename)

    return {
        "filenames": filenames
    }

@app.route("/deleteImage", methods=["POST"])
def deleteImage():
    """Delete the selected image."""
    imgName = request.get_json()['imgName']
    imgName = os.path.join(UPLOAD_FOLDER, 'calc_probabilities' ,imgName)
    
    os.remove(imgName)

    return {"status":"deleted"}

@app.route("/deleteAllImage", methods=["POST"])
def deleteAllImage():
    """Delete all the images in upload folder."""

    dir = os.path.join(UPLOAD_FOLDER, 'calc_probabilities')
    for f in os.listdir(dir):
        os.remove(os.path.join(dir, f))

    return {"status":"deleted all"}



@app.route("/addDescriptions", methods=["POST"])
def addDescriptions():
    """Add descriptions to descriptionSet.json."""

    des = request.get_json()['des']
    setName = request.get_json()['setName']

    descriptionSet = {
        "setName": setName,
        "descriptions": list(des.values())
        }
    json_object = json.dumps(descriptionSet, indent=4)

    FILE_PATH = "files/descriptionSet.json"

    if not os.path.isfile(FILE_PATH):
        dic = {}
        dic[setName] = descriptionSet

        with open(FILE_PATH, mode='w') as outfile:
            outfile.write(json.dumps(dic, indent=2))
    else:
        with open(FILE_PATH) as outfile:
            output = json.load(outfile)
        
        output[setName] = descriptionSet

        with open(FILE_PATH, mode='w') as outfile:
            outfile.write(json.dumps(output, indent=2))
    
    # global setNameList
    # setNameList.append(setName)

    return {"ok":"yes"}

@app.route("/getDescriptions/<setName>", methods=["GET"])
def getDescriptions(setName):
    """Get a list of descriptions by setName."""

    des = json.load(open('files/descriptionSet.json'))[setName]["descriptions"]

    return {"descriptions": des}

@app.route("/getProb/<setName>", methods=["GET"])
def getProbabilities(setName):
    """Calculate probabilities and return a list of probabilities."""

    des = json.load(open('files/descriptionSet.json'))[setName]["descriptions"]

    c = Clip(des, setName)
    res = c.getProbabilities()
    return res

@app.route("/classify/<setName>", methods=["GET"])
def classifyImage(setName):
    """Classify the selected Images using a set of categories in set <setName>."""

    # imgPath = os.path.join(UPLOAD_FOLDER, 'classify_Images')

    # if len(os.listdir(imgPath)) == 0:
    #     return {}

    getInfo = json.load(open('files/descriptionSet.json'))[setName]
    des = getInfo["descriptions"]
    setName = getInfo["setName"]

    c = Clip(des, setName)
    res = c.getImgClassification()
    
    return res

if __name__ == '__main__':
    app.run(debug=True)
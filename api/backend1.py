from tensorflow.keras.models import load_model
from flask import Flask, request, jsonify
import numpy as np
from flask_cors import CORS
import tensorflow as tf
from pymongo import MongoClient, ReturnDocument
from mongoengine import StringField, IntField, Document, ListField, BinaryField
import pandas as pd
import random




app = Flask(__name__)

CORS(app)
# Load the model
model = load_model('ai.keras')
df = pd.read_csv("products.csv")
client = MongoClient('mongodb+srv://anjannanisetti:WKpTBQCipHDiw6at@cluster0.rxggovj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')["data"]

class User(Document):
    name = StringField(required=True)
    password = StringField(required=True)
    

class Journal(Document):
    userId = StringField(required=True)
    images = ListField(BinaryField())
    scan_nums = ListField(BinaryField())




# for posting image to model and model returning the prediction
@app.route('/api/acne-detection', methods=['POST'])
def upload_image():
    try:
        print("HI")
        image = request.files['image']
        print(image)
        user_id = request.json.get('userID')


        image_path = "image.png"
        image.save(image_path)
        org_img = image
        image = tf.keras.preprocessing.image.load_img(image_path, target_size=(224, 224))
        image = tf.keras.preprocessing.image.img_to_array(image)
        image = image / 224.0
        image_array = np.expand_dims(image, axis=0)
        predictions = model.predict(image_array)
        print(predictions)
        predictions[4] = round(predictions[4])
        if predictions[4] < 0:
            predictions[4] = -1
        # Return a JSON response indicating success
        journal_entries = client['journal'].find({'userId': user_id})    
        journal_entries.scan_nums.append(predictions[4])
        journal_entries.images.append(org_img)
        journal_entries.save()
        return jsonify({'prediction': predictions})
    
    except Exception as e:
        # Return an error message if an exception occurs
        return jsonify({'error': str(e)})

#fetching journal-entries
@app.route('/api/journal-entries', methods=['GET'])
def get_journal_entries():
    try:
        user_id = request.headers.get('Authorization')  

        journal_entries = client['journal'].find({'userId': user_id})

        return jsonify(journal_entries), 200
    except Exception as e:
        print('Error fetching journal entries:', e)
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/get-product', methods=['GET'])
def get_product():
    try:
   
        class_value = int(request.json.get('class'))
        filtered_df = df[df['class'] == class_value]
        selected_product = filtered_df.sample(n=1)
        product_info = selected_product.iloc[0].to_dict()
        return jsonify(product_info), 200
    except Exception as e:
        # Return an error message if an exception occurs
        return jsonify({'error': str(e)}), 500


@app.route('/api/user/create', methods=['POST'])
def create_user():
    username = request.json.get('username')
    password = request.json.get('password')
   
    user = User(
        username=username,
        password=password
    )


    user.save()


    return "Success", 200

@app.route('/api/user/login', methods=['GET'])
def login_user():
    username = request.json.get("username")
    password = request.json.get("password")


    user = client['data']['users'].find_one({'username': username})


    if not user:
        return "Unkown user", 400
   
    if password != user.get('password', None):
        return "Invalid password", 400
   
    return jsonify({'user_id': user.get('_id', '')})



if __name__ == '__main__':
    app.run( host = "172.19.128.1", port=3000, debug=True)
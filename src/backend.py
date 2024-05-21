from pymongo import MongoClient
from bson import ObjectId
from flask import Flask,request, jsonify
from flask_cors import CORS
import pandas as pd
import json

backend = Flask(__name__)
CORS(backend)

    # Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
    # Access the database
db = client['map_project']
    # Access the collection
collection = db['India_map']
data = collection.find()


# To fetch the data from Database
@backend.route('/', methods=['GET'])
def import_data_from_mongodb():
    # Query the collection to retrieve data 
    data = collection.find()
    data = list(data)
    for item in data:
        item['_id'] = str(item['_id'])

    # df.to_json(orient='table')
    json_data=json.dumps(data);
    return json_data;


# To update the date into database
@backend.route('/update_value', methods=["GET","POST"])
def save_value():
    try:
        update_data = request.json
        # print(update_data['data'])
        for model in update_data['data']:
            print(ObjectId(model["_id"]))
            collection.update_one( 
            {"_id":ObjectId(model["_id"])}, 
             { 
            "$set": { 
                   model['ques']: int(model['ans'])
                  } 
            }   )
        return jsonify({'success': True, 'message': 'Excel file updated successfully'}),201
    except Exception as e:
        return jsonify({'success': False, 'message': 'Excel file  not updated successfully'}),500
    


# To add new value to the date into database
@backend.route('/add_new_value', methods=['POST'])
def add_new_value():
    try:
        # Get data from request
        data = request.json
        # Convert data to DataFrame
        df = pd.DataFrame(data['data'])

        # Add a new column with a value
        df['value_6'] = 0
    
        # Write updated data to Excel file
        # df.to_excel(r'D:\Projects\test\src\data.xlsx', index=False)
        
        return jsonify({'success': True, 'message': 'new column added successfully'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})


@backend.route('/delete_a_value', methods=['DELETE'])
def delete_attribute(attribute_name):
    try:
        # Update all documents in the collection to remove the specified attribute
        result = collection.update_many({}, {'$unset': {attribute_name: ''}})

        # Check if any documents were modified
        if result.modified_count == 0:
            return jsonify({'message': 'Attribute not found in any documents'}), 404

        return jsonify({'message': f'Attribute "{attribute_name}" deleted from {result.modified_count} documents'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500



if __name__ == '__main__':
    backend.run(port=3001)

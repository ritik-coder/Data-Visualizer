from pymongo import MongoClient
from bson import ObjectId
from flask import Flask,request, jsonify
from flask_cors import CORS

import pandas as pd
from fileinput import filename 
import json

api1 = Flask(__name__)
CORS(api1)

    # Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
    # Access the database
db = client['map_project']
    # Access the collection
collection = db['India_map']
data = collection.find()


# To fetch the data from Database
@api1.route('/', methods=['GET'])
def import_data_from_mongodb():
    # Query the collection to retrieve data 
    data = collection.find().sort({ "name" : 1 })
    data = list(data)
    # db.collection.find().sort({ name: 1 })
    for item in data:
        item['_id'] = str(item['_id'])
        # print(item['_id'])

    # df.to_json(orient='table')
    json_data=json.dumps(data);
    return json_data;


# To update the date into database
@api1.route('/update_value', methods=["GET","POST"])
def save_value():
    try:
        update_data = request.json
        for model in update_data['data']:
            collection.update_one( 
            {"_id":ObjectId(model["_id"])}, 
             { 
            "$set": { 
                   model['ques']: float(model['ans'])
                  } 
            }   )
        return jsonify({'success': True, 'message': 'Excel file updated successfully'}),201
    except Exception as e:
        return jsonify({'success': False, 'message': 'Excel file  not updated successfully'}),500
    


# To add new value to the date into database
@api1.route('/add_new_value', methods=['POST'])
def add_new_value():
    try:
        # Get data from request
        data = request.json
        # Convert data to DataFrame
        df = pd.DataFrame(data['data'])

        # Add a new column with a value
        # df['value_6'] = 0
    
        # Write updated data to Excel file
        # df.to_excel(r'D:\Projects\test\src\data.xlsx', index=False)
        
        return jsonify({'success': True, 'message': 'new column added successfully'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})


@api1.route('/delete_a_value', methods=['DELETE'])
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





@api1.route('/upload-data',  methods=["POST"])
def uploaddata():
    try: 
        f = request.files['file']

        df=pd.read_excel(f);
        print(df)

        def is_numeric(value):
            return pd.api.types.is_number(value)

        # Apply the function to the DataFrame, excluding the first column
        all_numeric = df.iloc[:, 1:].map(is_numeric).all().all()

        print("All values except in the first column are numeric:", all_numeric)

        if(not all_numeric):        
            return jsonify('all values are not numeric'), 500


        collection_name = 'India_map'
        if collection_name in db.list_collection_names():
           collection = db[collection_name]
            # Iterate over the rows of the DataFrame
           for index, row in df.iterrows():
        # Convert the row to a Python dictionary
             mongo_object = row.to_dict() 
             print(mongo_object)
             key=mongo_object.pop("name")
            #  mongo_object.pop("State")
        # Update existing document if it exists
             print(collection.find_one({'name':key}))
             
             collection.update_one({'_id':key}, {'$set': mongo_object}, upsert=True)
        else:
    # Create a new collection and insert documents
              collection = db[collection_name]
              for index, row in df.iterrows():
                   mongo_object = row.to_dict()
                   collection.insert_one(mongo_object)
                   
        return jsonify({'message': f'Attribute " deleted from documents'}), 200
    except Exception as e:   
        return jsonify({'message': str(e)}), 500
    

if __name__ == '__main__':
    api1.run(port=3001, debug=True)

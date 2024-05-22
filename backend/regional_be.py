from pymongo import MongoClient
from bson import ObjectId
from flask import Flask,request, jsonify
from flask_cors import CORS

import pandas as pd
from fileinput import filename 
import json

regional_be = Flask(__name__)
CORS(regional_be)

#     # Connect to MongoDB
# client = MongoClient('mongodb://localhost:27017/')
#     # Access the database
# db = client['map_project']
#     # Access the collection1
# collection1 = db['India_map']
# collection2 = db['Eastern_map']

def dbcollection():
        # Connect to MongoDB
    CONNECTION_STRING = "mongodb://mongodb0.erldc.in:27017,mongodb1.erldc.in:27017/?replicaSet=CONSERV"
    client = MongoClient(CONNECTION_STRING)
        # Access the database
    db = client['map_project']
        # Access the collection
    collection1 = db['India_map']
    collection2 = db['Eastern_map']

    return collection1,collection2

collection1,collection2 = dbcollection()

# To fetch the data from Database
@regional_be.route('/', methods=['GET'])
def import_data_from_mongodb():
    # Query the collection1 to retrieve data 
    data = collection1.find().sort({ "name" : 1 })
    data = list(data)
    # db.collection1.find().sort({ name: 1 })
    for item in data:
        item['_id'] = str(item['_id'])
        # print(item['_id'])

    # df.to_json(orient='table')
    json_data=json.dumps(data);
    return json_data;


# To update the date into database
@regional_be.route('/update_value', methods=["GET","POST"])
def save_value():
    try:
        update_data = request.json
        for model in update_data['data']:
            collection1.update_one( 
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
@regional_be.route('/add_new_value', methods=['POST'])
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


@regional_be.route('/delete_a_value', methods=['DELETE'])
def delete_attribute(attribute_name):
    try:
        # Update all documents in the collection1 to remove the specified attribute
        result = collection1.update_many({}, {'$unset': {attribute_name: ''}})

        # Check if any documents were modified
        if result.modified_count == 0:
            return jsonify({'message': 'Attribute not found in any documents'}), 404

        return jsonify({'message': f'Attribute "{attribute_name}" deleted from {result.modified_count} documents'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500





@regional_be.route('/upload-data',  methods=["POST"])
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
           collection1 = db[collection_name]
            # Iterate over the rows of the DataFrame
           for index, row in df.iterrows():
        # Convert the row to a Python dictionary
             mongo_object = row.to_dict() 
             print(mongo_object)
             key=mongo_object.pop("name")
            #  mongo_object.pop("State")
        # Update existing document if it exists
             print(collection1.find_one({'name':key}))
             
             collection1.update_one({'_id':key}, {'$set': mongo_object}, upsert=True)
        else:
    # Create a new collection1 and insert documents
              collection1 = db[collection_name]
              for index, row in df.iterrows():
                   mongo_object = row.to_dict()
                   collection1.insert_one(mongo_object)
                   
        return jsonify({'message': f'Attribute " deleted from documents'}), 200
    except Exception as e:   
        return jsonify({'message': str(e)}), 500
    


# :::::::::::::::::::::::::::::::::::::::::::Eastern Regional Data fectch api::::::::::::::::::::::::::::::::::::::::::::::::




# To fetch the data from Database
@regional_be.route('/eastern', methods=['GET'])
def import_data_from_mongodb_eastern():
    # Query the collection2 to retrieve data 
    data = collection2.find()
    data = list(data)
    for item in data:
        item['_id'] = str(item['_id'])

    # df.to_json(orient='table')
    json_data=json.dumps(data);
    return json_data;


# To update the date into database
@regional_be.route('/eastern/update_value', methods=["GET","POST"])
def save_value_eastern():
    try:
        update_data = request.json
        # print(update_data['data'])
        for model in update_data['data']:
            print(ObjectId(model["_id"]))
            collection2.update_one( 
            {"_id":ObjectId(model["_id"])}, 
             { 
            "$set": { 
                   model['ques']: float(model['ans'])
                  } 
            }   )
        return jsonify({'success': True, 'message': 'mongoDB  updated successfully'}),201
    except Exception as e:
        return jsonify({'success': False, 'message': 'mongoDB not updated successfully'}),500
    


# To add new value to the date into database
@regional_be.route('/eastern/add_new_value', methods=['POST'])
def add_new_value_eastern():
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


@regional_be.route('/eastern/delete_a_value', methods=['DELETE'])
def delete_attribute_eastren(attribute_name):
    try:
        # Update all documents in the collection2 to remove the specified attribute
        result = collection2.update_many({}, {'$unset': {attribute_name: ''}})

        # Check if any documents were modified
        if result.modified_count == 0:
            return jsonify({'message': 'Attribute not found in any documents'}), 404

        return jsonify({'message': f'Attribute "{attribute_name}" deleted from {result.modified_count} documents'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@regional_be.route('/eastern/upload-data',  methods=["POST"])
def uploaddata_eastern():
    try: 
        f = request.files['file']
        df=pd.read_excel(f);
        print(df) 

        # Function to check if a value is numeric
        def is_numeric(value):
            return pd.api.types.is_number(value)

        # Apply the function to the DataFrame, excluding the first column
        all_numeric = df.iloc[:, 1:].map(is_numeric).all().all()

        print("All values except in the first column are numeric:", all_numeric)

        if(not all_numeric):        
            return jsonify({'message': str(e)}), 500
        

        collection_name = 'Eastern_map'
        if collection_name in db.list_collection_names():
           collection2 = db[collection_name]
            # Iterate over the rows of the DataFrame
           for index, row in df.iterrows():
        # Convert the row to a Python dictionary
             mongo_object = row.to_dict()
            #  print(mongo_object)
             key=mongo_object.pop("name")
            #  mongo_object.pop("State")
  
            #  mongo_object.pop("_id")
             collection2.update_one({'name':key}, {'$set': mongo_object}, upsert=True)
        else:
    # Create a new collection2 and insert documents
              collection2 = db[collection_name]
              for index, row in df.iterrows():
                   mongo_object = row.to_dict()
                   collection2.insert_one(mongo_object)
                   
        return jsonify({'message': f'Attribute " deleted from documents'}), 200
    except Exception as e:   
        return jsonify({'message': str(e)}), 500



if __name__ == '__main__':
    regional_be.run(port=3001, debug=True)

from pymongo import MongoClient
from bson import ObjectId
from flask import Flask,request, jsonify
from flask_cors import CORS
import pandas as pd
import json

api2 = Flask(__name__)
CORS(api2)

    # Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
    # Access the database
db = client['map_project']
    # Access the collection
collection = db['Eastern_map']
data = collection.find()


# To fetch the data from Database
@api2.route('/eastern', methods=['GET'])
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
@api2.route('/eastern/update_value', methods=["GET","POST"])
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
                   model['ques']: float(model['ans'])
                  } 
            }   )
        return jsonify({'success': True, 'message': 'mongoDB  updated successfully'}),201
    except Exception as e:
        return jsonify({'success': False, 'message': 'mongoDB not updated successfully'}),500
    


# To add new value to the date into database
@api2.route('/eastern/add_new_value', methods=['POST'])
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


@api2.route('/eastern/delete_a_value', methods=['DELETE'])
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


@api2.route('/eastern/upload-data',  methods=["POST"])
def uploaddata():
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
           collection = db[collection_name]
            # Iterate over the rows of the DataFrame
           for index, row in df.iterrows():
        # Convert the row to a Python dictionary
             mongo_object = row.to_dict()
            #  print(mongo_object)
             key=mongo_object.pop("name")
            #  mongo_object.pop("State")
  
            #  mongo_object.pop("_id")
             collection.update_one({'name':key}, {'$set': mongo_object}, upsert=True)
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
    api2.run(port=3002)

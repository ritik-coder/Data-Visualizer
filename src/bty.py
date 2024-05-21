from flask import Flask,request, jsonify
from flask_cors import CORS
import json
import pandas as pd
from pymongo import MongoClient

bty = Flask(__name__)
CORS(bty)

# @bty.route('/', methods=['GET'])
# def get_value():
#     # param_value = request.args.get('paramValue', '')
#     df = pd.read_excel(r'D:\Projects\test\src\data.xlsx')
    
#     # result = f"Hello from Flask API! Received parameter: ${df}"
#     # print(df)
#     # return df.to_json(orient='table')
#     return df.to_json(orient='table')



# @bty.route('/save_value', methods=['POST'])
# def save_value():
#     try:
#         # Get data from request
#         data = request.json
#         # Convert data to DataFrame
#         df = pd.DataFrame(data['data'])
#         # Write updated data to Excel file
#         df.to_excel(r'D:\Projects\test\src\data.xlsx', index=False)
        
#         return jsonify({'success': True, 'message': 'Excel file updated successfully'})
#     except Exception as e:
#         return jsonify({'success': False, 'message': str(e)})




@bty.route('/add_new_value', methods=['POST'])
def add_new_value():
    try:
        # Get data from request
        data = request.json
        # Convert data to DataFrame
        df = pd.DataFrame(data['data'])

        # Add a new column with a value
        df['value_6'] = 0
    
        # Write updated data to Excel file
        df.to_excel(r'D:\Projects\test\src\data.xlsx', index=False)
        
        return jsonify({'success': True, 'message': 'new column added successfully'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})
   


if __name__ == '__main__':
    bty.run(port=3002)

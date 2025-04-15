from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sqlalchemy import create_engine, text
import os
import nbformat
from nbconvert.preprocessors import ExecutePreprocessor
import papermill as pm
import uuid

# Initialize SQLite database from CSV
def initialize_database():
    print("Initializing database...")
    engine = create_engine('sqlite:///flights.db')
    csv_path = 'airline_data.csv'

    if not os.path.exists(csv_path):
        csv_path = 'visualizing-airfare-trends-backend/airline_data.csv'
        if not os.path.exists(csv_path):
            if os.path.exists('flights.db'):
                print("CSV not found, using existing DB.")
                return engine
            raise FileNotFoundError("CSV file missing.")

    df = pd.read_csv(csv_path)
    df.to_sql('flights', engine, if_exists='replace', index=False)
    print("Database initialized.")
    return engine

db_engine = initialize_database()
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}})

def get_db_connection():
    return db_engine.connect()

@app.route('/api/routes', methods=['GET'])
def get_routes():
    try:
        conn = get_db_connection()
        query = text("""
        SELECT 
            airport_1, 
            airport_2, 
            COUNT(*) as frequency,
            AVG(fare) as avg_fare,
            SUM(passengers) as total_passengers
        FROM flights
        GROUP BY airport_1, airport_2
        ORDER BY total_passengers DESC
        LIMIT 150
        """)
        result = pd.read_sql_query(query, conn)
        conn.close()

        if not result.empty:
            max_passengers = result['total_passengers'].max()
            result['popularity'] = (result['total_passengers'] / max_passengers * 10).round(1)

        routes = [{
            'from': row['airport_1'],
            'to': row['airport_2'],
            'popularity': float(row['popularity']),
            'passengerCount': int(row['total_passengers']),
            'averageFare': float(row['avg_fare'])
        } for _, row in result.iterrows()]

        return jsonify(routes)

    except Exception as e:
        print(f"Error fetching routes: {e}")
        return jsonify({"error": str(e)}), 500

import os
import papermill as pm
import uuid

@app.route('/api/predict', methods=['POST'])
def predict_route_fare():
    try:
        data = request.get_json()
        departure = data.get("departure")
        arrival = data.get("arrival")
        start_date = data.get("startDate")
        end_date = data.get("endDate")
        event = data.get("event")

        if not all([departure, arrival, start_date, end_date]):
            return jsonify({"error": "Missing required fields."}), 400

        notebook_path = "visualizing-airfare-trends-backend/dataviz_draft.ipynb"
        if not os.path.exists(notebook_path):
            return jsonify({"error": "Notebook file not found."}), 500

        # 🔧 Ensure output folder exists
        os.makedirs("notebook_output", exist_ok=True)

        # Generate unique output notebook filename
        output_path = f"notebook_output/output_{uuid.uuid4().hex}.ipynb"

        # Execute the notebook with parameters
        pm.execute_notebook(
            input_path=notebook_path,
            output_path=output_path,
            parameters={
                "departure": departure,
                "arrival": arrival,
                "start_date": start_date,
                "end_date": end_date,
                "event": event
            },
            kernel_name="python3"
        )

        # Read the executed notebook
        executed_nb = nbformat.read(output_path, as_version=4)

        # Extract the last cell output
        last_cell = executed_nb.cells[-1]
        predicted_price = None

        if last_cell.cell_type == 'code':
            outputs = last_cell.get("outputs", [])
            for output in outputs:
                if output.output_type == "stream":
                    try:
                        predicted_price = float(output.text.strip())
                        break
                    except ValueError:
                        pass
                elif output.output_type == "execute_result":
                    try:
                        predicted_price = float(output["data"]["text/plain"])
                        break
                    except (ValueError, KeyError):
                        pass
        
        return jsonify({"predictedPrice": predicted_price})

    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/', methods=['GET'])
def home():
    return "Flight Data API is running!"

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')

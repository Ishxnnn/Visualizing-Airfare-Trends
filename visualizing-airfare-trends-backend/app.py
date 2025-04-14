from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
from sqlalchemy import create_engine, text
import os
import time

# Create a function to initialize the database
def initialize_database():
    print("Initializing database...")
    print(f"Current working directory: {os.getcwd()}")
    
    # Create a SQLite database
    engine = create_engine('sqlite:///flights.db')
    
    # Check if database needs to be created or updated
    needs_update = True
    
    # Try to find the CSV file
    csv_path = 'airline_data.csv'
    if not os.path.exists(csv_path):
        csv_path = 'visualizing-airfare-trends-backend/airline_data.csv'
        if not os.path.exists(csv_path):
            # If CSV not found but DB exists, we'll still continue
            if os.path.exists('flights.db'):
                print("CSV file not found, but using existing database.")
                needs_update = False
            else:
                raise FileNotFoundError(f"Cannot find CSV file at {csv_path}")
    
    # Only update database if needed
    if needs_update:
        print(f"Reading CSV from: {csv_path}")
        
        # Read your CSV file
        df = pd.read_csv(csv_path)
        print(f"CSV read successfully. Found {len(df)} rows")
        
        # Write to SQLite
        df.to_sql('flights', engine, if_exists='replace', index=False)
        
        print("Database created successfully!")
    
    print(f"Database located at: {os.path.abspath('flights.db')}")
    return engine

# Initialize database
db_engine = initialize_database()

# Create Flask application
app = Flask(__name__)

# Enable CORS with explicit configuration
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Database connection
def get_db_connection():
    return db_engine.connect()

@app.route('/api/routes', methods=['GET'])
def get_routes():
    try:
        # Get database connection
        conn = get_db_connection()
        
        # Build a simple query to get unique airport pairs
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
        
        # Execute the query and convert to DataFrame
        result = pd.read_sql_query(query, conn)
        conn.close()
        
        # Calculate popularity (scale of 1-10 based on passenger count)
        if not result.empty:
            max_passengers = result['total_passengers'].max()
            result['popularity'] = (result['total_passengers'] / max_passengers * 10).round(1)
        
        # Convert to list of dictionaries for the frontend
        routes = []
        for _, row in result.iterrows():
            routes.append({
                'from': row['airport_1'],
                'to': row['airport_2'],
                'popularity': float(row['popularity']),
                'passengerCount': int(row['total_passengers']),
                'averageFare': float(row['avg_fare'])
            })
        
        return jsonify(routes)
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/', methods=['GET'])
def home():
    return "Flight Data API is running!"

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True, port=5000, host='0.0.0.0')
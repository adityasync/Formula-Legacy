import pandas as pd
from sqlalchemy import create_engine, text
import os
import re
import sys

print("Starting ETL Script...", flush=True)

# Database Configuration
if os.getenv('DATABASE_URL'):
    DATABASE_URL = os.getenv('DATABASE_URL')
else:
    DB_USER = 'racinglines'
    DB_PASS = 'checkeredflag'
    DB_NAME = 'f1pedia'
    DB_HOST = 'localhost'
    DB_PORT = '5432'
    DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Column Mapping Helper
def camel_to_snake(name):
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()

def load_schema(engine):
    print("Initializing Database Schema...")
    schema_path = os.path.join(os.path.dirname(__file__), 'schema.sql')
    with open(schema_path, 'r') as file:
        schema_sql = file.read()
        with engine.connect() as connection:
            connection.execute(text(schema_sql))
            connection.commit()
    print("Schema initialized successfully.")

def load_csv(engine, file_path, table_name, chunksize=None):
    print(f"Loading {table_name} from {file_path}...")
    
    # Check if file exists
    if not os.path.exists(file_path):
        print(f"Warning: File {file_path} not found. Skipping.")
        return

    try:
        if chunksize:
            # Process in chunks
            with pd.read_csv(file_path, chunksize=chunksize, na_values=[r'\N']) as reader:
                for i, chunk in enumerate(reader):
                    # Normalize columns
                    chunk.columns = [camel_to_snake(col) for col in chunk.columns]
                    chunk.to_sql(table_name, engine, if_exists='append', index=False, method='multi')
                    print(f"  Loaded chunk {i+1}...")
        else:
            # Load entire file
            df = pd.read_csv(file_path, na_values=[r'\N'])
            df.columns = [camel_to_snake(col) for col in df.columns]
            df.to_sql(table_name, engine, if_exists='append', index=False, method='multi')
        
        print(f"Successfully loaded {table_name}.")
        
    except Exception as e:
        print(f"Error loading {table_name}: {e}")

def main():
    engine = create_engine(DATABASE_URL)
    
    # Initialize Schema
    load_schema(engine)
    
    # Clean up existing data (Optional, but good for idempotency if we had a clean script. 
    # For now, we rely on IF NOT EXISTS in schema and if_exists='append' (or 'replace' if we want to reset).
    # Since schema uses 'IF NOT EXISTS', we should probably TRUNCATE first if we want a fresh start, 
    # but let's assume we want to just load. If tables exist and are full, this might duplicate.
    # Safe approach: Truncate tables in reverse dependency order.
    
    with engine.connect() as connection:
        print("Cleaning up old data...")
        tables = [
            'constructor_results', 'constructor_standings', 'driver_standings', 
            'lap_times', 'pit_stops', 'qualifying', 'sprint_results', 'results', 
            'races', 'seasons', 'drivers', 'constructors', 'circuits', 'status'
        ]
        for table in tables:
            connection.execute(text(f"TRUNCATE TABLE {table} CASCADE;"))
        connection.commit()
    
    # Base Directory for CSVs
    data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../F1'))
    
    # Load Order (Dependencies First)
    load_csv(engine, os.path.join(data_dir, 'circuits.csv'), 'circuits')
    load_csv(engine, os.path.join(data_dir, 'constructors.csv'), 'constructors')
    load_csv(engine, os.path.join(data_dir, 'drivers.csv'), 'drivers')
    load_csv(engine, os.path.join(data_dir, 'seasons.csv'), 'seasons')
    load_csv(engine, os.path.join(data_dir, 'status.csv'), 'status')
    
    # Dependent Performance Tables
    load_csv(engine, os.path.join(data_dir, 'races.csv'), 'races')
    load_csv(engine, os.path.join(data_dir, 'results.csv'), 'results')
    load_csv(engine, os.path.join(data_dir, 'sprint_results.csv'), 'sprint_results')
    load_csv(engine, os.path.join(data_dir, 'qualifying.csv'), 'qualifying')
    load_csv(engine, os.path.join(data_dir, 'pit_stops.csv'), 'pit_stops')
    
    # Large File - Chunked Load
    load_csv(engine, os.path.join(data_dir, 'lap_times.csv'), 'lap_times', chunksize=10000)
    
    # Standings
    load_csv(engine, os.path.join(data_dir, 'driver_standings.csv'), 'driver_standings')
    load_csv(engine, os.path.join(data_dir, 'constructor_standings.csv'), 'constructor_standings')
    load_csv(engine, os.path.join(data_dir, 'constructor_results.csv'), 'constructor_results')
    
    print("ETL Pipeline Complete.")

if __name__ == "__main__":
    main()

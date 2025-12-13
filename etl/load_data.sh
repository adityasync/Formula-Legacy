#!/bin/bash
DB_URL=$1
if [ -z "$DB_URL" ]; then
  echo "Usage: ./load_data.sh <DATABASE_URL>"
  exit 1
fi

# Function to clean and load
load_table() {
  TABLE=$1
  FILE=$2
  echo "Loading $TABLE from $FILE..."
  
  if [ ! -f "$FILE" ]; then
    echo "File $FILE not found!"
    return
  fi
  
  # Create temp file with header replacement (CamelCase -> snake_case)
  # We only apply to first line (header)
  HEAD=$(head -n 1 $FILE)
  NEW_HEAD=$(echo "$HEAD" | perl -pe 's/([a-z0-9])([A-Z])/$1_\L$2/g')
  
  echo "$NEW_HEAD" > temp_load.csv
  tail -n +2 "$FILE" >> temp_load.csv
  
  # Psql copy
  psql "$DB_URL" -c "\copy $TABLE FROM 'temp_load.csv' WITH CSV HEADER"
  rm temp_load.csv
}

# Load Order
load_table circuits F1/circuits.csv
load_table constructors F1/constructors.csv
load_table drivers F1/drivers.csv
load_table seasons F1/seasons.csv
load_table status F1/status.csv
load_table races F1/races.csv
load_table results F1/results.csv
load_table sprint_results F1/sprint_results.csv
load_table qualifying F1/qualifying.csv
load_table pit_stops F1/pit_stops.csv
load_table lap_times F1/lap_times.csv
load_table driver_standings F1/driver_standings.csv
load_table constructor_standings F1/constructor_standings.csv
load_table constructor_results F1/constructor_results.csv

echo "ETL Complete!"

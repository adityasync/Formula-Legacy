"""
Feature Engineering for F1 Race Prediction Models
Builds training features from raw CSV data
"""

import pandas as pd
import numpy as np
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "F1"

def load_data():
    """Load all CSV files into DataFrames"""
    data = {
        'results': pd.read_csv(DATA_DIR / 'results.csv', na_values=['\\N', '']),
        'races': pd.read_csv(DATA_DIR / 'races.csv', na_values=['\\N', '']),
        'drivers': pd.read_csv(DATA_DIR / 'drivers.csv', na_values=['\\N', '']),
        'constructors': pd.read_csv(DATA_DIR / 'constructors.csv', na_values=['\\N', '']),
        'qualifying': pd.read_csv(DATA_DIR / 'qualifying.csv', na_values=['\\N', '']),
        'circuits': pd.read_csv(DATA_DIR / 'circuits.csv', na_values=['\\N', '']),
        'driver_standings': pd.read_csv(DATA_DIR / 'driver_standings.csv', na_values=['\\N', '']),
        'lap_times': pd.read_csv(DATA_DIR / 'lap_times.csv', na_values=['\\N', '']),
    }
    
    # Clean results - ensure numeric types
    results = data['results']
    results['position'] = pd.to_numeric(results['position'], errors='coerce')
    results['grid'] = pd.to_numeric(results['grid'], errors='coerce')
    results['points'] = pd.to_numeric(results['points'], errors='coerce')
    
    # Clean qualifying
    qualifying = data['qualifying']
    qualifying['position'] = pd.to_numeric(qualifying['position'], errors='coerce')
    
    return data

def compute_driver_stats(results_df, races_df, lookback=10):
    """
    Compute rolling driver statistics
    - Win rate
    - Podium rate
    - Average finish position
    - DNF rate
    """
    # Merge results with races for year info
    df = results_df.merge(races_df[['raceId', 'year', 'circuitId', 'round']], on='raceId')
    df = df.sort_values(['driverId', 'year', 'round'])
    
    # Convert position to numeric (handle 'R', 'D', etc.)
    df['position'] = pd.to_numeric(df['position'], errors='coerce')
    
    # Create features per driver
    driver_stats = []
    
    for driver_id in df['driverId'].unique():
        driver_df = df[df['driverId'] == driver_id].copy()
        
        # Rolling stats (last N races)
        driver_df['is_win'] = (driver_df['position'] == 1).astype(int)
        driver_df['is_podium'] = (driver_df['position'] <= 3).astype(int)
        driver_df['is_dnf'] = (driver_df['position'].isna() | (driver_df['statusId'] != 1)).astype(int)
        
        driver_df['rolling_wins'] = driver_df['is_win'].rolling(lookback, min_periods=1).sum()
        driver_df['rolling_podiums'] = driver_df['is_podium'].rolling(lookback, min_periods=1).sum()
        driver_df['rolling_avg_pos'] = driver_df['position'].rolling(lookback, min_periods=1).mean()
        driver_df['rolling_dnf_rate'] = driver_df['is_dnf'].rolling(lookback, min_periods=1).mean()
        driver_df['career_starts'] = range(1, len(driver_df) + 1)
        
        driver_stats.append(driver_df)
    
    return pd.concat(driver_stats, ignore_index=True)

def compute_constructor_stats(results_df, races_df, lookback=10):
    """Compute rolling constructor statistics"""
    df = results_df.merge(races_df[['raceId', 'year', 'round']], on='raceId')
    df = df.sort_values(['constructorId', 'year', 'round'])
    
    # Aggregate by constructor per race
    constructor_race = df.groupby(['constructorId', 'raceId']).agg({
        'points': 'sum',
        'position': 'mean'
    }).reset_index()
    
    constructor_race = constructor_race.sort_values(['constructorId', 'raceId'])
    
    constructor_stats = []
    for constructor_id in constructor_race['constructorId'].unique():
        c_df = constructor_race[constructor_race['constructorId'] == constructor_id].copy()
        c_df['rolling_points'] = c_df['points'].rolling(lookback, min_periods=1).mean()
        c_df['rolling_avg_pos'] = c_df['position'].rolling(lookback, min_periods=1).mean()
        constructor_stats.append(c_df)
    
    return pd.concat(constructor_stats, ignore_index=True)

def compute_circuit_stats(results_df, races_df):
    """Compute circuit-specific statistics"""
    df = results_df.merge(races_df[['raceId', 'circuitId']], on='raceId')
    
    # DNF rate per circuit
    circuit_stats = df.groupby('circuitId').agg({
        'statusId': lambda x: (x != 1).mean(),  # DNF rate
        'position': 'mean',
        'raceId': 'nunique'
    }).reset_index()
    
    circuit_stats.columns = ['circuitId', 'circuit_dnf_rate', 'circuit_avg_pos', 'circuit_races']
    return circuit_stats

def compute_driver_circuit_history(results_df, races_df):
    """Compute driver performance at each circuit historically"""
    df = results_df.merge(races_df[['raceId', 'circuitId']], on='raceId')
    
    history = df.groupby(['driverId', 'circuitId']).agg({
        'position': 'mean',
        'points': 'sum',
        'raceId': 'count'
    }).reset_index()
    
    history.columns = ['driverId', 'circuitId', 'driver_circuit_avg_pos', 'driver_circuit_points', 'driver_circuit_races']
    return history

def build_race_prediction_features():
    """
    Build the main training dataset for race winner prediction
    Each row = one driver in one race
    Target = 1 if won, 0 otherwise
    """
    print("Loading data...")
    data = load_data()
    
    results = data['results']
    races = data['races']
    qualifying = data['qualifying']
    
    print("Computing driver stats...")
    driver_stats = compute_driver_stats(results, races)
    
    print("Computing constructor stats...")
    constructor_stats = compute_constructor_stats(results, races)
    
    print("Computing circuit stats...")
    circuit_stats = compute_circuit_stats(results, races)
    
    print("Computing driver-circuit history...")
    driver_circuit = compute_driver_circuit_history(results, races)
    
    print("Merging features...")
    # Start with driver stats (has all relevant info)
    df = driver_stats.copy()
    
    # Add constructor stats
    df = df.merge(
        constructor_stats[['constructorId', 'raceId', 'rolling_points', 'rolling_avg_pos']],
        on=['constructorId', 'raceId'],
        how='left',
        suffixes=('', '_constructor')
    )
    
    # Add circuit stats
    df = df.merge(circuit_stats, on='circuitId', how='left')
    
    # Add qualifying data
    quali_features = qualifying[['raceId', 'driverId', 'position']].copy()
    quali_features.columns = ['raceId', 'driverId', 'quali_position']
    df = df.merge(quali_features, on=['raceId', 'driverId'], how='left')
    
    # Add driver-circuit history
    df = df.merge(driver_circuit, on=['driverId', 'circuitId'], how='left')
    
    # Target: did driver win?
    df['target'] = (df['position'] == 1).astype(int)
    
    # Select features
    feature_cols = [
        'grid',                    # Starting position
        'quali_position',          # Qualifying position
        'rolling_wins',            # Recent wins
        'rolling_podiums',         # Recent podiums
        'rolling_avg_pos',         # Recent average finish
        'rolling_dnf_rate',        # Recent DNF rate
        'career_starts',           # Experience
        'rolling_points',          # Constructor recent points
        'rolling_avg_pos_constructor',  # Constructor recent avg position
        'circuit_dnf_rate',        # Circuit DNF rate
        'driver_circuit_avg_pos',  # Driver's history at this circuit
        'driver_circuit_races',    # How many times raced here
    ]
    
    # Filter to valid rows (modern era with qualifying data)
    df_filtered = df[df['year'] >= 2003].copy()  # Qualifying format changed in 2003
    df_filtered = df_filtered.dropna(subset=['grid', 'quali_position'])
    
    # Fill remaining NaN with 0 or median
    for col in feature_cols:
        if col in df_filtered.columns:
            df_filtered[col] = df_filtered[col].fillna(df_filtered[col].median())
    
    print(f"Training data shape: {df_filtered.shape}")
    print(f"Win rate: {df_filtered['target'].mean():.3%}")
    
    return df_filtered, feature_cols

def build_points_prediction_features():
    """Build training dataset for points prediction"""
    df, feature_cols = build_race_prediction_features()
    df['target'] = df['points']  # Change target to points
    return df, feature_cols

if __name__ == "__main__":
    df, features = build_race_prediction_features()
    print(f"\nFeatures: {features}")
    print(f"\nSample data:\n{df[features + ['target']].head()}")
    
    # Save to CSV for inspection
    output_path = Path(__file__).parent / "training_data.csv"
    df[features + ['target', 'raceId', 'driverId', 'year']].to_csv(output_path, index=False)
    print(f"\nSaved to {output_path}")

"""
Train Points Prediction Model
Uses Gradient Boosting to predict finishing points
"""

import pandas as pd
import numpy as np
from pathlib import Path
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.ensemble import GradientBoostingRegressor
import pickle

from feature_engineering import build_points_prediction_features

MODEL_DIR = Path(__file__).parent / "models"
MODEL_DIR.mkdir(exist_ok=True)

def train_points_model():
    """Train Gradient Boosting model for points prediction"""
    
    print("=" * 60)
    print("F1 POINTS PREDICTION MODEL")
    print("=" * 60)
    
    # Load features
    df, feature_cols = build_points_prediction_features()
    
    # Prepare training data
    X = df[feature_cols].values
    y = df['target'].values  # Points
    
    # Train/test split
    df['is_test'] = df['year'] >= 2022
    X_train = df[~df['is_test']][feature_cols].values
    X_test = df[df['is_test']][feature_cols].values
    y_train = df[~df['is_test']]['target'].values
    y_test = df[df['is_test']]['target'].values
    
    print(f"\nTraining samples: {len(X_train)}")
    print(f"Test samples: {len(X_test)}")
    print(f"Average points in training: {y_train.mean():.2f}")
    
    # Train Gradient Boosting
    print("\nTraining Gradient Boosting Regressor...")
    model = GradientBoostingRegressor(
        n_estimators=200,
        max_depth=5,
        learning_rate=0.1,
        subsample=0.8,
        random_state=42
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    y_pred = np.clip(y_pred, 0, 26)  # Points can't be negative or > 26 (25 + fastest lap)
    
    print("\n" + "=" * 40)
    print("MODEL PERFORMANCE")
    print("=" * 40)
    print(f"RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.4f}")
    print(f"MAE: {mean_absolute_error(y_test, y_pred):.4f}")
    print(f"R²: {r2_score(y_test, y_pred):.4f}")
    
    # Feature importance
    print("\n" + "=" * 40)
    print("FEATURE IMPORTANCE")
    print("=" * 40)
    importance = pd.DataFrame({
        'feature': feature_cols,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    print(importance.to_string(index=False))
    
    # Save model
    model_path = MODEL_DIR / "points_predictor_gb.pkl"
    with open(model_path, 'wb') as f:
        pickle.dump({
            'model': model,
            'features': feature_cols
        }, f)
    print(f"\nModel saved to {model_path}")
    
    return model, feature_cols

if __name__ == "__main__":
    model, features = train_points_model()
    print("\n✅ Training complete!")

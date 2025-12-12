"""
Train Race Winner Prediction Model
Uses XGBoost classifier to predict probability of winning
"""

import pandas as pd
import numpy as np
from pathlib import Path
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, roc_auc_score, classification_report
from xgboost import XGBClassifier
import pickle

from feature_engineering import build_race_prediction_features

MODEL_DIR = Path(__file__).parent / "models"
MODEL_DIR.mkdir(exist_ok=True)

def train_race_winner_model():
    """Train XGBoost model for race winner prediction"""
    
    print("=" * 60)
    print("F1 RACE WINNER PREDICTION MODEL")
    print("=" * 60)
    
    # Load features
    df, feature_cols = build_race_prediction_features()
    
    # Prepare training data
    X = df[feature_cols].values
    y = df['target'].values
    
    # Train/test split (use recent years for testing)
    df['is_test'] = df['year'] >= 2022
    X_train = df[~df['is_test']][feature_cols].values
    X_test = df[df['is_test']][feature_cols].values
    y_train = df[~df['is_test']]['target'].values
    y_test = df[df['is_test']]['target'].values
    
    print(f"\nTraining samples: {len(X_train)}")
    print(f"Test samples: {len(X_test)}")
    print(f"Features: {len(feature_cols)}")
    
    # Train XGBoost
    print("\nTraining XGBoost classifier...")
    model = XGBClassifier(
        n_estimators=200,
        max_depth=6,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        scale_pos_weight=len(y_train) / y_train.sum(),  # Handle class imbalance
        random_state=42,
        use_label_encoder=False,
        eval_metric='logloss'
    )
    
    model.fit(
        X_train, y_train,
        eval_set=[(X_test, y_test)],
        verbose=False
    )
    
    # Evaluate
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]
    
    print("\n" + "=" * 40)
    print("MODEL PERFORMANCE")
    print("=" * 40)
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print(f"ROC-AUC: {roc_auc_score(y_test, y_prob):.4f}")
    
    # Feature importance
    print("\n" + "=" * 40)
    print("FEATURE IMPORTANCE")
    print("=" * 40)
    importance = pd.DataFrame({
        'feature': feature_cols,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    print(importance.to_string(index=False))
    
    # Cross-validation
    print("\n" + "=" * 40)
    print("CROSS-VALIDATION")
    print("=" * 40)
    cv_scores = cross_val_score(model, X, y, cv=5, scoring='roc_auc')
    print(f"CV ROC-AUC: {cv_scores.mean():.4f} (+/- {cv_scores.std()*2:.4f})")
    
    # Save model
    model_path = MODEL_DIR / "race_winner_xgb.pkl"
    with open(model_path, 'wb') as f:
        pickle.dump({
            'model': model,
            'features': feature_cols
        }, f)
    print(f"\nModel saved to {model_path}")
    
    # Also save feature importance
    importance.to_csv(MODEL_DIR / "feature_importance.csv", index=False)
    
    return model, feature_cols

def predict_race_winner(model, features, race_data):
    """
    Predict win probability for each driver in a race
    
    race_data: DataFrame with one row per driver, containing feature columns
    Returns: DataFrame with driver_id and win_probability
    """
    X = race_data[features].values
    probabilities = model.predict_proba(X)[:, 1]
    
    result = race_data[['driverId']].copy()
    result['win_probability'] = probabilities
    result = result.sort_values('win_probability', ascending=False)
    
    return result

if __name__ == "__main__":
    model, features = train_race_winner_model()
    print("\n✅ Training complete!")

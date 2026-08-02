import os
import json
import joblib
import pandas as pd
import numpy as np
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

from dataset_generator import generate_energy_dataset
from preprocessing import prepare_monthly_data

def train_monthly():
    base_dir = os.path.dirname(__file__)
    data_path = os.path.join(base_dir, 'data', 'energy_consumption.csv')
    
    if os.path.exists(data_path):
        df = pd.read_csv(data_path)
    else:
        df = generate_energy_dataset()
        os.makedirs(os.path.dirname(data_path), exist_ok=True)
        df.to_csv(data_path, index=False)
        
    X, y, feature_names = prepare_monthly_data(df)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train XGBoost Regressor
    model = XGBRegressor(
        n_estimators=200,
        learning_rate=0.05,
        max_depth=6,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42
    )
    model.fit(X_train_scaled, y_train)
    
    y_pred = model.predict(X_test_scaled)
    
    rmse = float(np.sqrt(mean_squared_error(y_test, y_pred)))
    mae = float(mean_absolute_error(y_test, y_pred))
    r2 = float(r2_score(y_test, y_pred))
    
    feature_importances = dict(zip(feature_names, [float(fi) for fi in model.feature_importances_]))
    
    metrics = {
        'model_name': 'XGBoost Regressor (XGBRegressor)',
        'rmse': round(rmse, 4),
        'mae': round(mae, 4),
        'r2': round(r2, 4),
        'feature_importances': feature_importances
    }
    
    models_dir = os.path.join(base_dir, 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    model_bundle = {
        'model': model,
        'scaler': scaler,
        'feature_names': feature_names,
        'metrics': metrics
    }
    
    joblib.dump(model_bundle, os.path.join(models_dir, 'monthly_model.joblib'))
    
    metrics_file = os.path.join(models_dir, 'monthly_metrics.json')
    with open(metrics_file, 'w') as f:
        json.dump(metrics, f, indent=2)
        
    print(f"XGBoost Monthly Model Trained successfully!")
    print(f"RMSE: {rmse:.4f} | MAE: {mae:.4f} | R2: {r2:.4f}")
    return metrics

if __name__ == '__main__':
    train_monthly()

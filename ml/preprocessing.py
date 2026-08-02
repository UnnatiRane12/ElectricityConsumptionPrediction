import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler

DAILY_FEATURES = [
    'Month', 'DayOfWeek', 'IsHoliday', 'Temperature', 'Humidity',
    'SquareFootArea', 'Occupancy', 'HVACUsage', 'LightingUsage', 'RenewableEnergy',
    'SqFtPerPerson', 'CoolingDegreeDays', 'RenewableOffset'
]

MONTHLY_FEATURES = [
    'Month', 'Temperature', 'Humidity',
    'SquareFootArea', 'Occupancy', 'HVACUsage', 'LightingUsage', 'RenewableEnergy',
    'SqFtPerPerson', 'CoolingDegreeDays', 'RenewableOffset'
]

def engineer_features(df):
    df = df.copy()
    
    # Handle missing values if any
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    for col in numeric_cols:
        if df[col].isnull().sum() > 0:
            df[col] = df[col].fillna(df[col].median())
            
    # Feature Engineering
    df['SqFtPerPerson'] = (df['SquareFootArea'] / (df['Occupancy'] + 1e-5)).round(2)
    df['CoolingDegreeDays'] = np.maximum(0, df['Temperature'] - 18.0).round(2)
    df['RenewableOffset'] = (df['SquareFootArea'] * (df['RenewableEnergy'] / 100.0)).round(2)
    
    return df

def prepare_daily_data(df):
    df_feat = engineer_features(df)
    X = df_feat[DAILY_FEATURES]
    y = df_feat['DailyConsumption_kWh']
    return X, y, DAILY_FEATURES

def prepare_monthly_data(df):
    df_feat = engineer_features(df)
    X = df_feat[MONTHLY_FEATURES]
    y = df_feat['MonthlyConsumption_kWh']
    return X, y, MONTHLY_FEATURES

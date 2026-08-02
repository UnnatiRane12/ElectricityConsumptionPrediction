import os
import numpy as np
import pandas as pd

def generate_energy_dataset(num_samples=5000, seed=42):
    np.random.seed(seed)
    
    months = np.random.randint(1, 13, size=num_samples)
    days_of_week = np.random.randint(0, 7, size=num_samples) # 0=Mon, 6=Sun
    is_holiday = np.random.choice([0, 1], size=num_samples, p=[0.85, 0.15])
    
    # Seasonal temperature logic (celsius)
    base_temp = 22 + 8 * np.sin((months - 4) * np.pi / 6)
    temperature = np.random.normal(base_temp, 4.5).round(1)
    humidity = np.clip(np.random.normal(55 + 5 * np.cos((months) * np.pi / 6), 12), 20, 95).round(1)
    
    # Building features
    sqft_area = np.random.choice([800, 1200, 1500, 1800, 2200, 2800, 3500, 4500, 5000], size=num_samples)
    occupancy = np.random.randint(1, 10, size=num_samples)
    
    # Appliances & equipment usage
    hvac_usage = np.clip(np.random.normal(6 + 0.3 * np.abs(temperature - 21), 2), 0, 24).round(1) # hours/day
    lighting_usage = np.clip(np.random.normal(5 + 0.1 * occupancy, 1.5), 1, 16).round(1) # hours/day
    renewable_energy = np.clip(np.random.normal(12 - 0.2 * humidity, 4), 0, 35).round(1) # % offset
    
    # Baseline Daily kWh formula based on physics & empirical correlations
    base_kwh = (
        (sqft_area * 0.006) +
        (occupancy * 1.8) +
        (hvac_usage * 1.65) +
        (lighting_usage * 0.85) +
        (np.abs(temperature - 20) * 0.45) +
        (is_holiday * 2.2) -
        (renewable_energy * 0.22)
    )
    noise = np.random.normal(0, 1.8, size=num_samples)
    daily_kwh = np.clip(base_kwh + noise, 3.5, 95.0).round(2)
    
    # Monthly kWh ~ daily_kwh * 30 + seasonal variance
    monthly_kwh = np.clip(daily_kwh * 30 + np.random.normal(0, 45, size=num_samples), 100, 2800).round(2)
    
    df = pd.DataFrame({
        'Month': months,
        'DayOfWeek': days_of_week,
        'IsHoliday': is_holiday,
        'Temperature': temperature,
        'Humidity': humidity,
        'SquareFootArea': sqft_area,
        'Occupancy': occupancy,
        'HVACUsage': hvac_usage,
        'LightingUsage': lighting_usage,
        'RenewableEnergy': renewable_energy,
        'DailyConsumption_kWh': daily_kwh,
        'MonthlyConsumption_kWh': monthly_kwh
    })
    
    return df

if __name__ == '__main__':
    data_dir = os.path.join(os.path.dirname(__file__), 'data')
    os.makedirs(data_dir, exist_ok=True)
    csv_path = os.path.join(data_dir, 'energy_consumption.csv')
    df = generate_energy_dataset()
    df.to_csv(csv_path, index=False)
    print(f"Generated {len(df)} rows of energy consumption dataset at {csv_path}")

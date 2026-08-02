import sys
import os
from sqlalchemy.orm import Session
from app.database import Base, engine, SessionLocal
from app.models import User, Prediction, Bill
from app.auth import get_password_hash

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    
    # Check if demo user exists
    demo_user = db.query(User).filter(User.email == "demo@powerpredict.com").first()
    if not demo_user:
        demo_user = User(
            full_name="Alex Mercer",
            email="demo@powerpredict.com",
            hashed_password=get_password_hash("password123"),
            role="admin"
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)
        print(f"Created demo user: demo@powerpredict.com / password123")
        
        # Seed sample predictions
        sample_preds = [
            {
                "type": "daily",
                "kwh": 28.5,
                "confidence": 96.4,
                "status": "Green",
                "category": "Standard User",
                "amount": 209.50,
                "model": "GradientBoostingRegressor v1.0",
                "inputs": {"Month": 7, "DayOfWeek": 2, "IsHoliday": 0, "Temperature": 26.5, "Humidity": 55, "SquareFootArea": 1800, "Occupancy": 3, "HVACUsage": 6.5, "LightingUsage": 5.0, "RenewableEnergy": 12.0}
            },
            {
                "type": "monthly",
                "kwh": 420.0,
                "confidence": 95.8,
                "status": "Orange",
                "category": "Heavy User",
                "amount": 4230.00,
                "model": "RandomForestRegressor v1.0",
                "inputs": {"Month": 6, "Temperature": 32.0, "Humidity": 68, "SquareFootArea": 2400, "Occupancy": 4, "HVACUsage": 10.0, "LightingUsage": 7.5, "RenewableEnergy": 8.0}
            },
            {
                "type": "daily",
                "kwh": 14.2,
                "confidence": 97.1,
                "status": "Green",
                "category": "Eco User",
                "amount": 109.40,
                "model": "GradientBoostingRegressor v1.0",
                "inputs": {"Month": 4, "DayOfWeek": 6, "IsHoliday": 1, "Temperature": 21.0, "Humidity": 45, "SquareFootArea": 1200, "Occupancy": 2, "HVACUsage": 3.0, "LightingUsage": 4.0, "RenewableEnergy": 25.0}
            }
        ]
        
        for idx, sp in enumerate(sample_preds):
            pred = Prediction(
                user_id=demo_user.id,
                prediction_type=sp["type"],
                inputs=sp["inputs"],
                predicted_kwh=sp["kwh"],
                confidence=sp["confidence"],
                status=sp["status"],
                category=sp["category"],
                bill_amount=sp["amount"],
                model_used=sp["model"]
            )
            db.add(pred)
            db.commit()
            db.refresh(pred)
            
            bill = Bill(
                prediction_id=pred.id,
                user_id=demo_user.id,
                bill_number=f"INV-SEED-00{idx+1}",
                prediction_type=sp["type"],
                predicted_units=sp["kwh"],
                tariff_rate=6.5 if sp["type"] == "monthly" else 7.0,
                energy_charge=sp["amount"] * 0.85,
                fixed_charge=50.0,
                taxes=sp["amount"] * 0.08,
                total_amount=sp["amount"],
                category=sp["category"]
            )
            db.add(bill)
            db.commit()
        print("Seeded sample prediction records and bills successfully.")
    else:
        print("Demo user already exists.")
    db.close()

if __name__ == '__main__':
    seed_database()

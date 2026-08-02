import sys
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../ml')))
import predict as ml_predict

from app.database import Base, engine
from app.routes import auth_routes, prediction_routes, bill_routes, analytics_routes, admin_routes

# Create database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PowerPredict API",
    description="Smart Electricity Consumption Prediction & Analytics Platform",
    version="1.0.0"
)

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth_routes.router)
app.include_router(prediction_routes.router)
app.include_router(bill_routes.router)
app.include_router(analytics_routes.router)
app.include_router(admin_routes.router)

@app.on_event("startup")
def startup_event():
    try:
        ml_predict.load_models()
        print("ML Models loaded successfully on FastAPI startup.")
    except Exception as e:
        print(f"Warning loading ML models on startup: {e}")

@app.get("/")
def root():
    return {
        "title": "PowerPredict API",
        "status": "Online",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/api/ml-metrics")
def get_ml_metrics():
    ml_predict.load_models()
    return {
        "daily_model": ml_predict.daily_bundle.get("metrics", {}) if ml_predict.daily_bundle else {},
        "monthly_model": ml_predict.monthly_bundle.get("metrics", {}) if ml_predict.monthly_bundle else {}
    }

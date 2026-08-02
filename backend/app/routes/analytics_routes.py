import sys
import os
import json
import numpy as np
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from sqlalchemy import func

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../ml')))
import predict as ml_predict

from app.database import get_db
from app.models import User, Prediction, Bill
from app.auth import get_current_user
from app.schemas import ProfileSummaryResponse

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("/dashboard-stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_preds = db.query(Prediction).filter(Prediction.user_id == current_user.id).all()
    count = len(user_preds)
    avg_kwh = round(np.mean([p.predicted_kwh for p in user_preds]), 2) if count > 0 else 0.0
    avg_bill = round(np.mean([p.bill_amount for p in user_preds]), 2) if count > 0 else 0.0
    last_pred = user_preds[-1] if count > 0 else None
    
    return {
        "prediction_count": count,
        "average_consumption": avg_kwh,
        "average_bill": avg_bill,
        "last_prediction_kwh": last_pred.predicted_kwh if last_pred else 0.0,
        "last_prediction_date": last_pred.created_at if last_pred else None,
        "last_prediction_category": last_pred.category if last_pred else "N/A"
    }

@router.get("/charts")
def get_analytics_charts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns data for the 14 interactive charts on the Analytics Hub,
    combining the user's prediction history and default XGBoost baseline benchmarks.
    """
    user_preds = db.query(Prediction).filter(Prediction.user_id == current_user.id).order_by(Prediction.created_at.desc()).all()
    
    # Latest predicted kWh for consumption gauge
    latest_kwh = user_preds[0].predicted_kwh if user_preds else 33.2

    # 1. Consumption Gauge
    consumption_gauge = {
        "current_kwh": round(latest_kwh, 2),
        "max_kwh": 80.0
    }

    # 2. Daily Consumption Line Chart (7 Days)
    daily_line = [
        {"day": "Mon", "predicted_kwh": 31.4, "baseline_kwh": 34.0},
        {"day": "Tue", "predicted_kwh": 29.8, "baseline_kwh": 33.5},
        {"day": "Wed", "predicted_kwh": 33.2, "baseline_kwh": 35.0},
        {"day": "Thu", "predicted_kwh": 35.6, "baseline_kwh": 36.2},
        {"day": "Fri", "predicted_kwh": 38.1, "baseline_kwh": 37.5},
        {"day": "Sat", "predicted_kwh": 27.5, "baseline_kwh": 31.0},
        {"day": "Sun", "predicted_kwh": 26.2, "baseline_kwh": 30.5},
    ]

    # 3. Monthly Consumption Bar Chart (12 Months)
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    monthly_base = [780, 720, 810, 890, 1050, 1240, 1330, 1280, 1100, 950, 840, 790]
    monthly_bar = [
        {"month": m, "consumption_kwh": float(val)}
        for m, val in zip(months, monthly_base)
    ]

    # 4. Energy Load Breakdown Pie Chart
    energy_pie = [
        {"name": "HVAC Cooling/Heating", "value": 42, "color": "#0284C7"},
        {"name": "Lighting Systems", "value": 18, "color": "#F59E0B"},
        {"name": "Base Appliances & Plug Loads", "value": 25, "color": "#8B5CF6"},
        {"name": "Renewable Offset", "value": 15, "color": "#10B981"},
    ]

    # 5. Temperature vs Consumption Scatter Plot
    temp_scatter = [
        {"temperature": 18.0, "consumption": 22.4},
        {"temperature": 22.0, "consumption": 26.1},
        {"temperature": 25.5, "consumption": 30.2},
        {"temperature": 28.5, "consumption": 33.2},
        {"temperature": 32.0, "consumption": 41.5},
        {"temperature": 35.0, "consumption": 48.0},
        {"temperature": 38.0, "consumption": 54.2},
    ]

    # 6. Occupancy vs Consumption Bubble Chart
    occupancy_bubble = [
        {"occupancy": 1, "consumption": 21.0, "size": 80},
        {"occupancy": 2, "consumption": 26.5, "size": 110},
        {"occupancy": 3, "consumption": 33.2, "size": 140},
        {"occupancy": 4, "consumption": 39.8, "size": 180},
        {"occupancy": 5, "consumption": 46.0, "size": 220},
        {"occupancy": 6, "consumption": 52.4, "size": 260},
    ]

    # 7. HVAC vs Lighting Usage Comparison
    hvac_vs_lighting = [
        {"month": "Jan", "hvac": 12.0, "lighting": 5.5},
        {"month": "Apr", "hvac": 14.5, "lighting": 5.0},
        {"month": "Jul", "hvac": 22.0, "lighting": 4.5},
        {"month": "Oct", "hvac": 16.0, "lighting": 5.2},
    ]

    # 8. Renewable Offset Contribution Donut Chart
    renewable_donut = [
        {"name": "Grid Power Draw", "value": 78, "color": "#0284C7"},
        {"name": "Solar / Renewable Offset", "value": 22, "color": "#10B981"},
    ]

    # 9. Customer Category Distribution
    category_distribution = [
        {"category": "Residential", "count": 145, "color": "#0EA5E9"},
        {"category": "Commercial", "count": 82, "color": "#F59E0B"},
        {"category": "Industrial", "count": 34, "color": "#EF4444"},
        {"category": "Agricultural", "count": 56, "color": "#10B981"},
    ]

    # 10. Monthly Bill Comparison (INR)
    monthly_bills = [
        {"month": m, "bill_amount": round(val * 6.5, 2)}
        for m, val in zip(months[:6], monthly_base[:6])
    ]

    # 11. Prediction History Timeline
    prediction_timeline = []
    if user_preds:
        for p in user_preds[:6]:
            prediction_timeline.append({
                "type": p.prediction_type.capitalize() if p.prediction_type else "Daily",
                "kwh": round(p.predicted_kwh, 2),
                "date": p.created_at.strftime("%b %d, %Y") if hasattr(p.created_at, 'strftime') else str(p.created_at)[:10],
                "amount": round(p.bill_amount, 2)
            })
    else:
        prediction_timeline = [
            {"type": "Daily", "kwh": 33.2, "date": "Today", "amount": 243.86},
            {"type": "Monthly", "kwh": 898.26, "date": "Yesterday", "amount": 6580.10}
        ]

    # 12. Actual vs Predicted Evaluation
    actual_vs_predicted = [
        {"sample": "S1", "actual": 30.5, "predicted": 31.4},
        {"sample": "S2", "actual": 28.9, "predicted": 29.8},
        {"sample": "S3", "actual": 34.1, "predicted": 33.2},
        {"sample": "S4", "actual": 36.0, "predicted": 35.6},
        {"sample": "S5", "actual": 37.2, "predicted": 38.1},
        {"sample": "S6", "actual": 26.8, "predicted": 27.5},
    ]

    # 13. ML Feature Importance (XGBoost)
    feature_importance = [
        {"feature": "SquareFootArea", "importance": 49.5},
        {"feature": "Occupancy", "importance": 18.7},
        {"feature": "SqFtPerPerson", "importance": 12.4},
        {"feature": "HVACUsage", "importance": 10.7},
        {"feature": "Temperature", "importance": 2.3},
        {"feature": "LightingUsage", "importance": 1.4},
        {"feature": "RenewableEnergy", "importance": 0.6},
    ]

    # 14. Energy Saving Potential
    saving_potential = [
        {"name": "Smart HVAC Thermostat Scheduling", "potential_percent": 18, "fill": "#0284C7"},
        {"name": "LED Lighting Transition", "potential_percent": 12, "fill": "#F59E0B"},
        {"name": "Rooftop Solar Expansion (Solar+)", "potential_percent": 25, "fill": "#10B981"},
        {"name": "Peak-Demand Load Shifting", "potential_percent": 15, "fill": "#8B5CF6"},
    ]

    return {
        "consumption_gauge": consumption_gauge,
        "daily_line": daily_line,
        "monthly_bar": monthly_bar,
        "energy_pie": energy_pie,
        "temp_scatter": temp_scatter,
        "occupancy_bubble": occupancy_bubble,
        "hvac_vs_lighting": hvac_vs_lighting,
        "renewable_donut": renewable_donut,
        "category_distribution": category_distribution,
        "monthly_bills": monthly_bills,
        "prediction_timeline": prediction_timeline,
        "actual_vs_predicted": actual_vs_predicted,
        "feature_importance": feature_importance,
        "saving_potential": saving_potential
    }

@router.post("/prediction-specific")
def get_prediction_specific_analytics(payload: dict = Body(...)):
    """
    Generates 8 prediction-specific charts dynamically from the user's actual entered inputs and prediction output.
    """
    prediction_type = payload.get("prediction_type", "daily")
    inputs = payload.get("inputs", {})
    predicted_kwh = float(payload.get("predicted_kwh", 28.5))
    bill_info = payload.get("bill_info", {})
    selected_category = payload.get("category", "Residential")

    temp = float(inputs.get("Temperature", 25.0))
    humidity = float(inputs.get("Humidity", 55.0))
    sqft = float(inputs.get("SquareFootArea", 1800.0))
    occupancy = int(inputs.get("Occupancy", 3))
    hvac = float(inputs.get("HVACUsage", 6.0))
    lighting = float(inputs.get("LightingUsage", 5.0))
    renewable = float(inputs.get("RenewableEnergy", 10.0))

    if prediction_type == "daily":
        hvac_kwh = round(hvac * 1.65, 2)
        lighting_kwh = round(lighting * 0.85, 2)
        renewable_offset_kwh = round(predicted_kwh * (renewable / 100.0), 2)
        grid_kwh = round(max(0, predicted_kwh - renewable_offset_kwh), 2)
        base_kwh = round(max(0, predicted_kwh - hvac_kwh - lighting_kwh), 2)

        # 1. Gauge
        gauge_data = {"current_kwh": predicted_kwh, "max_kwh": 80.0}

        # 2. Input Features Summary
        input_summary = [
            {"feature": "SqFt Area (hundreds)", "value": round(sqft / 100.0, 1)},
            {"feature": "Temperature (°C)", "value": temp},
            {"feature": "Occupancy", "value": occupancy},
            {"feature": "HVAC (hrs)", "value": hvac},
            {"feature": "Lighting (hrs)", "value": lighting},
            {"feature": "Renewable (%)", "value": renewable}
        ]

        # 3. Temp vs Consumption
        temp_vs_consumption = [
            {"temp": round(t, 1), "consumption": round(predicted_kwh + (t - temp) * 0.45, 2)}
            for t in np.linspace(temp - 10, temp + 10, 7)
        ]

        # 4. HVAC vs Lighting Usage
        hvac_vs_lighting = [
            {"category": "HVAC System", "hours": hvac, "estimated_kwh": hvac_kwh},
            {"category": "Lighting System", "hours": lighting, "estimated_kwh": lighting_kwh}
        ]

        # 5. Renewable Contribution Donut
        renewable_contribution = [
            {"name": "Grid Power Draw", "value": grid_kwh, "color": "#0284C7"},
            {"name": "Solar / Renewable Offset", "value": renewable_offset_kwh, "color": "#10B981"}
        ]

        # 6. Energy Consumption Breakdown
        consumption_breakdown = [
            {"name": "HVAC System", "value": hvac_kwh, "color": "#0284C7"},
            {"name": "Lighting Usage", "value": lighting_kwh, "color": "#F59E0B"},
            {"name": "Base Appliances Load", "value": base_kwh, "color": "#8B5CF6"},
            {"name": "Renewable Offset", "value": renewable_offset_kwh, "color": "#10B981"}
        ]

        # 7. Bill Breakdown
        bill_breakdown = [
            {"charge": "Energy Charge", "amount": bill_info.get("energy_charge", 0.0)},
            {"charge": "Fixed Charge", "amount": bill_info.get("fixed_charge", 0.0)},
            {"charge": "State Taxes (8%)", "amount": bill_info.get("taxes", 0.0)}
        ]

        # 8. Category Summary
        category_summary = [
            {"category": "Agricultural", "rate": 3.50, "color": "#10B981"},
            {"category": "Residential", "rate": 6.50, "color": "#0EA5E9"},
            {"category": "Commercial", "rate": 9.20, "color": "#F59E0B"},
            {"category": "Industrial", "rate": 11.50, "color": "#EF4444"}
        ]

        return {
            "type": "daily",
            "gauge": gauge_data,
            "input_summary": input_summary,
            "temp_vs_consumption": temp_vs_consumption,
            "hvac_vs_lighting": hvac_vs_lighting,
            "renewable_contribution": renewable_contribution,
            "consumption_breakdown": consumption_breakdown,
            "bill_breakdown": bill_breakdown,
            "category_summary": category_summary
        }

    else: # Monthly Prediction Specific Charts
        daily_avg = round(predicted_kwh / 30.0, 2)
        hvac_monthly_kwh = round(hvac * 1.65 * 30.0, 1)
        lighting_monthly_kwh = round(lighting * 0.85 * 30.0, 1)
        solar_monthly_offset = round(predicted_kwh * (renewable / 100.0), 1)
        grid_monthly = round(predicted_kwh - solar_monthly_offset, 1)

        # 1. Monthly Consumption Trend (30 Days)
        days_trend = [
            {"day": f"Day {d}", "consumption_kwh": round(daily_avg + np.sin(d * 0.5) * 2.5, 1)}
            for d in range(1, 31, 3)
        ]

        # 2. Estimated Bill Breakdown
        bill_breakdown = [
            {"charge": "Energy Charge", "amount": bill_info.get("energy_charge", 0.0)},
            {"charge": "Fixed Charge", "amount": bill_info.get("fixed_charge", 0.0)},
            {"charge": "State Duty Taxes", "amount": bill_info.get("taxes", 0.0)}
        ]

        # 3. Renewable Energy Savings
        renewable_savings = [
            {"name": "Grid Utility Draw", "value": grid_monthly, "color": "#0284C7"},
            {"name": "Solar Energy Savings", "value": solar_monthly_offset, "color": "#10B981"}
        ]

        # 4. HVAC Contribution
        hvac_contribution = [
            {"name": "HVAC Power Demand", "value": hvac_monthly_kwh, "color": "#0284C7"},
            {"name": "Other Building Loads", "value": round(predicted_kwh - hvac_monthly_kwh, 1), "color": "#E2E8F0"}
        ]

        # 5. Lighting Contribution
        lighting_contribution = [
            {"name": "Lighting Power Demand", "value": lighting_monthly_kwh, "color": "#F59E0B"},
            {"name": "Other Building Loads", "value": round(predicted_kwh - lighting_monthly_kwh, 1), "color": "#E2E8F0"}
        ]

        # 6. Occupancy Impact
        occupancy_impact = [
            {"occupancy": occ, "estimated_kwh": round(predicted_kwh * (0.7 + occ * 0.1), 1)}
            for occ in range(1, 10, 2)
        ]

        # 7. Consumption Distribution
        consumption_dist = [
            {"category": "HVAC", "kwh": hvac_monthly_kwh},
            {"category": "Lighting", "kwh": lighting_monthly_kwh},
            {"category": "Appliances", "kwh": round(predicted_kwh * 0.25, 1)},
            {"category": "Renewable Offset", "kwh": solar_monthly_offset}
        ]

        # 8. Category Summary
        category_summary = [
            {"category": "Agricultural", "rate": 3.50, "color": "#10B981"},
            {"category": "Residential", "rate": 6.50, "color": "#0EA5E9"},
            {"category": "Commercial", "rate": 9.20, "color": "#F59E0B"},
            {"category": "Industrial", "rate": 11.50, "color": "#EF4444"}
        ]

        return {
            "type": "monthly",
            "daily_avg": daily_avg,
            "days_trend": days_trend,
            "bill_breakdown": bill_breakdown,
            "renewable_savings": renewable_savings,
            "hvac_contribution": hvac_contribution,
            "lighting_contribution": lighting_contribution,
            "occupancy_impact": occupancy_impact,
            "consumption_dist": consumption_dist,
            "category_summary": category_summary
        }

@router.get("/profile", response_model=ProfileSummaryResponse)
def get_user_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    preds = db.query(Prediction).filter(Prediction.user_id == current_user.id).all()
    count = len(preds)
    avg_kwh = round(np.mean([p.predicted_kwh for p in preds]), 2) if count > 0 else 0.0
    avg_bill = round(np.mean([p.bill_amount for p in preds]), 2) if count > 0 else 0.0
    last_date = preds[-1].created_at if count > 0 else None
    
    return ProfileSummaryResponse(
        user=current_user,
        prediction_count=count,
        average_consumption=avg_kwh,
        average_bill=avg_bill,
        last_prediction_date=last_date
    )

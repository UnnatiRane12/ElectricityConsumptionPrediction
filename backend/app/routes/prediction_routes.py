import uuid
import sys
import os
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../ml')))
import predict as ml_predict

from app.database import get_db
from app.models import User, Prediction, Bill
from app.schemas import DailyPredictionInput, MonthlyPredictionInput, PredictionResponse, RecalculateBillRequest
from app.auth import get_current_user

router = APIRouter(prefix="/api/predict", tags=["Prediction"])

@router.post("/daily", response_model=PredictionResponse)
def predict_daily_endpoint(
    input_data: DailyPredictionInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    input_dict = input_data.dict()
    category = input_dict.get('category', 'Residential')
    
    result = ml_predict.predict_daily(input_dict, category=category)
    
    # Save Prediction to Database
    prediction_record = Prediction(
        user_id=current_user.id,
        prediction_type='daily',
        inputs=input_dict,
        predicted_kwh=result['predicted_kwh'],
        confidence=result['prediction_confidence'],
        status=result['color_indicator'],
        category=category,
        bill_amount=result['bill_info']['total_amount'],
        model_used=result['model_used']
    )
    db.add(prediction_record)
    db.commit()
    db.refresh(prediction_record)
    
    # Auto-generate Bill record
    bill_number = f"INV-D-{uuid.uuid4().hex[:6].upper()}"
    bill_record = Bill(
        prediction_id=prediction_record.id,
        user_id=current_user.id,
        bill_number=bill_number,
        prediction_type='daily',
        predicted_units=result['predicted_kwh'],
        tariff_rate=result['bill_info']['tariff_rate'],
        energy_charge=result['bill_info']['energy_charge'],
        fixed_charge=result['bill_info']['fixed_charge'],
        taxes=result['bill_info']['taxes'],
        total_amount=result['bill_info']['total_amount'],
        category=category
    )
    db.add(bill_record)
    db.commit()
    
    response = PredictionResponse.from_orm(prediction_record)
    response.insights = result['insights']
    response.bill_info = result['bill_info']
    return response

@router.post("/monthly", response_model=PredictionResponse)
def predict_monthly_endpoint(
    input_data: MonthlyPredictionInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    input_dict = input_data.dict()
    category = input_dict.get('category', 'Residential')
    
    result = ml_predict.predict_monthly(input_dict, category=category)
    
    # Save Prediction to Database
    prediction_record = Prediction(
        user_id=current_user.id,
        prediction_type='monthly',
        inputs=input_dict,
        predicted_kwh=result['predicted_kwh'],
        confidence=result['prediction_confidence'],
        status=result['bill_info']['badge'],
        category=category,
        bill_amount=result['bill_info']['total_amount'],
        model_used=result['model_used']
    )
    db.add(prediction_record)
    db.commit()
    db.refresh(prediction_record)
    
    # Auto-generate Bill record
    bill_number = f"INV-M-{uuid.uuid4().hex[:6].upper()}"
    bill_record = Bill(
        prediction_id=prediction_record.id,
        user_id=current_user.id,
        bill_number=bill_number,
        prediction_type='monthly',
        predicted_units=result['predicted_kwh'],
        tariff_rate=result['bill_info']['tariff_rate'],
        energy_charge=result['bill_info']['energy_charge'],
        fixed_charge=result['bill_info']['fixed_charge'],
        taxes=result['bill_info']['taxes'],
        total_amount=result['bill_info']['total_amount'],
        category=category
    )
    db.add(bill_record)
    db.commit()
    
    response = PredictionResponse.from_orm(prediction_record)
    response.insights = result['insights']
    response.bill_info = result['bill_info']
    return response

@router.post("/recalculate-bill")
def recalculate_bill_endpoint(req: RecalculateBillRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    bill_info = ml_predict.calculate_bill_charges(req.predicted_kwh, category=req.category, is_monthly=req.is_monthly)
    return bill_info

@router.get("/history", response_model=List[PredictionResponse])
def get_prediction_history(
    type_filter: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Prediction).filter(Prediction.user_id == current_user.id)
    
    if type_filter and type_filter in ['daily', 'monthly']:
        query = query.filter(Prediction.prediction_type == type_filter)
        
    predictions = query.order_by(desc(Prediction.created_at)).all()
    
    if search:
        search_lower = search.lower()
        predictions = [
            p for p in predictions 
            if search_lower in p.category.lower() or search_lower in p.prediction_type.lower() or search_lower in str(p.predicted_kwh)
        ]
        
    return [PredictionResponse.from_orm(p) for p in predictions]

@router.delete("/history/{prediction_id}")
def delete_prediction(
    prediction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    pred = db.query(Prediction).filter(Prediction.id == prediction_id, Prediction.user_id == current_user.id).first()
    if not pred:
        raise HTTPException(status_code=404, detail="Prediction record not found.")
        
    db.delete(pred)
    db.commit()
    return {"message": "Prediction record deleted successfully."}

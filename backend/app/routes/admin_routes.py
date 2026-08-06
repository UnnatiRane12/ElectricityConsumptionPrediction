from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import User, Prediction, Bill
from app.schemas import AdminSummaryResponse, UserResponse
from app.auth import get_current_user

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.get("/dashboard", response_model=AdminSummaryResponse)
def get_admin_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total_users = db.query(func.count(User.id)).scalar() or 0
    total_predictions = db.query(func.count(Prediction.id)).scalar() or 0
    total_bills_amount = db.query(func.sum(Bill.total_amount)).scalar() or 0.0
    
    cat_counts = db.query(Prediction.category, func.count(Prediction.id)).group_by(Prediction.category).all()
    category_distribution = {cat: count for cat, count in cat_counts}
    
    recent_users = db.query(User).order_by(User.created_at.desc()).limit(10).all()
    
    return AdminSummaryResponse(
        total_users=total_users,
        total_predictions=total_predictions,
        total_bills_amount=round(float(total_bills_amount), 2),
        category_distribution=category_distribution,
        recent_users=[UserResponse.model_validate(u) for u in recent_users]
    )

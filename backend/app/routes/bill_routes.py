from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Bill, Prediction
from app.schemas import BillResponse
from app.auth import get_current_user
from app.utils.pdf_generator import generate_bill_pdf

router = APIRouter(prefix="/api/bills", tags=["Bills"])

@router.get("/prediction/{prediction_id}", response_model=BillResponse)
def get_bill_by_prediction(
    prediction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    bill = db.query(Bill).filter(Bill.prediction_id == prediction_id, Bill.user_id == current_user.id).first()
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found for this prediction.")
    
    resp = BillResponse.model_validate(bill)
    resp.customer_name = current_user.full_name
    return resp

@router.get("/{bill_id}/pdf")
def download_bill_pdf(
    bill_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    bill = db.query(Bill).filter(Bill.id == bill_id, Bill.user_id == current_user.id).first()
    if not bill:
        raise HTTPException(status_code=404, detail="Bill record not found.")
        
    bill_dict = {
        'bill_number': bill.bill_number,
        'prediction_type': bill.prediction_type,
        'predicted_units': bill.predicted_units,
        'tariff_rate': bill.tariff_rate,
        'energy_charge': bill.energy_charge,
        'fixed_charge': bill.fixed_charge,
        'taxes': bill.taxes,
        'total_amount': bill.total_amount,
        'category': bill.category,
        'user_id': bill.user_id
    }
    
    pdf_bytes = generate_bill_pdf(bill_dict, current_user.full_name, current_user.email)
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=PowerPredict_Bill_{bill.bill_number}.pdf"
        }
    )

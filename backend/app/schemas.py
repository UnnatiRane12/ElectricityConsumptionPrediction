from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

# User Schemas
class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Daily Input Schema
class DailyPredictionInput(BaseModel):
    Month: int = Field(..., ge=1, le=12)
    DayOfWeek: int = Field(..., ge=0, le=6)
    IsHoliday: int = Field(..., ge=0, le=1)
    Temperature: float = Field(..., ge=-20, le=55)
    Humidity: float = Field(..., ge=0, le=100)
    SquareFootArea: float = Field(..., ge=100, le=20000)
    Occupancy: int = Field(..., ge=1, le=50)
    HVACUsage: float = Field(..., ge=0, le=24)
    LightingUsage: float = Field(..., ge=0, le=24)
    RenewableEnergy: float = Field(..., ge=0, le=100)
    category: Optional[str] = "Residential"

# Monthly Input Schema
class MonthlyPredictionInput(BaseModel):
    Month: int = Field(..., ge=1, le=12)
    Temperature: float = Field(..., ge=-20, le=55)
    Humidity: float = Field(..., ge=0, le=100)
    SquareFootArea: float = Field(..., ge=100, le=20000)
    Occupancy: int = Field(..., ge=1, le=50)
    HVACUsage: float = Field(..., ge=0, le=24)
    LightingUsage: float = Field(..., ge=0, le=24)
    RenewableEnergy: float = Field(..., ge=0, le=100)
    category: Optional[str] = "Residential"

# Bill Recalculation Request
class RecalculateBillRequest(BaseModel):
    predicted_kwh: float
    category: str # Residential, Commercial, Industrial, Agricultural
    is_monthly: bool = True

# Prediction Response Schema
class PredictionResponse(BaseModel):
    id: int
    user_id: int
    prediction_type: str
    inputs: Dict[str, Any]
    predicted_kwh: float
    confidence: float
    status: str
    category: str
    bill_amount: float
    model_used: str
    created_at: datetime
    insights: Optional[List[str]] = None
    bill_info: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

# Bill Schema
class BillResponse(BaseModel):
    id: int
    prediction_id: int
    user_id: int
    bill_number: str
    prediction_date: datetime
    prediction_type: str
    predicted_units: float
    tariff_rate: float
    energy_charge: float
    fixed_charge: float
    taxes: float
    total_amount: float
    category: str
    customer_name: Optional[str] = None

    class Config:
        from_attributes = True

# Profile Summary
class ProfileSummaryResponse(BaseModel):
    user: UserResponse
    prediction_count: int
    average_consumption: float
    average_bill: float
    last_prediction_date: Optional[datetime] = None

# Admin Summary
class AdminSummaryResponse(BaseModel):
    total_users: int
    total_predictions: int
    total_bills_amount: float
    category_distribution: Dict[str, int]
    recent_users: List[UserResponse]

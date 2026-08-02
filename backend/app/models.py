from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default='user') # 'user' or 'admin'
    created_at = Column(DateTime, default=datetime.utcnow)
    
    predictions = relationship('Prediction', back_populates='user', cascade='all, delete-orphan')
    bills = relationship('Bill', back_populates='user', cascade='all, delete-orphan')

class Prediction(Base):
    __tablename__ = 'predictions'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    prediction_type = Column(String(20), nullable=False) # 'daily' or 'monthly'
    inputs = Column(JSON, nullable=False)
    predicted_kwh = Column(Float, nullable=False)
    confidence = Column(Float, default=96.0)
    status = Column(String(20), nullable=False) # 'Green', 'Yellow', 'Red'
    category = Column(String(50), nullable=False)
    bill_amount = Column(Float, nullable=False)
    model_used = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship('User', back_populates='predictions')
    bill = relationship('Bill', back_populates='prediction', uselist=False, cascade='all, delete-orphan')

class Bill(Base):
    __tablename__ = 'bills'
    
    id = Column(Integer, primary_key=True, index=True)
    prediction_id = Column(Integer, ForeignKey('predictions.id', ondelete='CASCADE'), nullable=False, unique=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    bill_number = Column(String(50), unique=True, index=True, nullable=False)
    prediction_date = Column(DateTime, default=datetime.utcnow)
    prediction_type = Column(String(20), nullable=False)
    predicted_units = Column(Float, nullable=False)
    tariff_rate = Column(Float, nullable=False)
    energy_charge = Column(Float, nullable=False)
    fixed_charge = Column(Float, nullable=False)
    taxes = Column(Float, nullable=False)
    total_amount = Column(Float, nullable=False)
    category = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship('User', back_populates='bills')
    prediction = relationship('Prediction', back_populates='bill')

class CustomerCategory(Base):
    __tablename__ = 'customer_categories'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    min_kwh = Column(Float, nullable=False)
    max_kwh = Column(Float, nullable=False)
    badge = Column(String(50), nullable=False)
    color = Column(String(20), nullable=False)
    tariff_description = Column(String(150), nullable=False)

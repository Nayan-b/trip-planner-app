from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db
from .auth import get_current_user

router = APIRouter(
    prefix="/bookings",
    tags=["bookings"],
)

@router.post("/", response_model=schemas.Booking)
def create_booking(booking: schemas.BookingCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    trip = db.query(models.Trip).filter(models.Trip.id == booking.trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    db_booking = models.Booking(
        user_id=current_user.id,
        trip_id=booking.trip_id,
        status="pending",
        total_price=trip.price
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

@router.get("/", response_model=List[schemas.Booking])
def get_bookings(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.is_admin:
        return db.query(models.Booking).all()
    return db.query(models.Booking).filter(models.Booking.user_id == current_user.id).all()

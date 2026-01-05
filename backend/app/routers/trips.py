from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db
from .auth import get_current_admin_user
from geoalchemy2.elements import WKTElement

router = APIRouter(
    prefix="/trips",
    tags=["trips"],
)

@router.get("/", response_model=List[schemas.Trip])
def get_trips(
    skip: int = 0, 
    limit: int = 100, 
    search: str = None,
    min_price: float = None,
    max_price: float = None,
    min_rating: float = None,
    db: Session = Depends(get_db)
):
    """
    Get trips with optional search and filter parameters.
    
    - **search**: Search in trip name and description
    - **min_price**: Minimum price filter
    - **max_price**: Maximum price filter
    - **min_rating**: Minimum rating filter
    """
    query = db.query(models.Trip)
    
    # Search filter
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (models.Trip.name.ilike(search_filter)) | 
            (models.Trip.description.ilike(search_filter))
        )
    
    # Price filters
    if min_price is not None:
        query = query.filter(models.Trip.price >= min_price)
    if max_price is not None:
        query = query.filter(models.Trip.price <= max_price)
    
    # Rating filter
    if min_rating is not None:
        query = query.filter(models.Trip.rating >= min_rating)
    
    trips = query.offset(skip).limit(limit).all()
    return trips

@router.get("/{trip_id}", response_model=schemas.Trip)
def get_trip(trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(models.Trip).filter(models.Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip

@router.post("/", response_model=schemas.Trip)
def create_trip(trip: schemas.TripCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_admin_user)):
    db_trip = models.Trip(**trip.model_dump())
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)
    return db_trip

@router.post("/{trip_id}/destinations", response_model=schemas.Destination)
def create_destination(trip_id: int, dest: schemas.DestinationCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_admin_user)):
    trip = db.query(models.Trip).filter(models.Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    point = WKTElement(f'POINT({dest.lon} {dest.lat})', srid=4326)
    db_dest = models.Destination(
        trip_id=trip_id,
        name=dest.name,
        description=dest.description,
        coordinate=point
    )
    db.add(db_dest)
    db.commit()
    db.refresh(db_dest)
    return db_dest
    
@router.post("/{trip_id}/itinerary", response_model=schemas.ItineraryItem)
def create_itinerary_item(trip_id: int, item: schemas.ItineraryItemCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_admin_user)):
    trip = db.query(models.Trip).filter(models.Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    db_item = models.ItineraryItem(trip_id=trip_id, **item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.put("/{trip_id}", response_model=schemas.Trip)
def update_trip(trip_id: int, trip_update: schemas.TripUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_admin_user)):
    db_trip = db.query(models.Trip).filter(models.Trip.id == trip_id).first()
    if not db_trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    update_data = trip_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_trip, key, value)
    
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)
    return db_trip

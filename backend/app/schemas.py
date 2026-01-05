from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any
from datetime import datetime
from decimal import Decimal

# Auth
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_admin: bool

    class Config:
        from_attributes = True

# Itinerary
class ItineraryItemBase(BaseModel):
    day_number: int
    title: str
    description: Optional[str] = None

class ItineraryItemCreate(ItineraryItemBase):
    pass

class ItineraryItem(ItineraryItemBase):
    id: int
    trip_id: int

    class Config:
        from_attributes = True

# Destination
class DestinationBase(BaseModel):
    name: str
    description: Optional[str] = None

class DestinationCreate(DestinationBase):
    lat: float
    lon: float

class Destination(DestinationBase):
    id: int
    trip_id: int
    lat: float
    lon: float
    
    # We will handle converting DB Geometry to lat/lon in the route or using a custom type config
    # For now, let's assume the ORM model helps us or we map it manually.
    
    class Config:
        from_attributes = True

# Trip
class TripBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: Optional[Decimal] = None
    image_url: Optional[str] = None

class TripCreate(TripBase):
    pass

class TripUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    image_url: Optional[str] = None

class Trip(TripBase):
    id: int
    rating: float
    destinations: List[Destination] = []
    itinerary_items: List[ItineraryItem] = []

    class Config:
        from_attributes = True

# Booking
class BookingBase(BaseModel):
    trip_id: int

class BookingCreate(BookingBase):
    pass

class Booking(BookingBase):
    id: int
    user_id: int
    status: str
    created_at: datetime
    total_price: Optional[Decimal]
    
    class Config:
        from_attributes = True

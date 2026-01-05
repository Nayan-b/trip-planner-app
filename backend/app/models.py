from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Float, Text, DateTime, DECIMAL
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
from .database import Base
import enum

class BookingStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String)
    hashed_password = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False)

    bookings = relationship("Booking", back_populates="user")

class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(Text)
    price = Column(DECIMAL(10, 2))
    rating = Column(Float, default=0.0) # For simplicity, manually set or calculated
    image_url = Column(String)
    
    destinations = relationship("Destination", back_populates="trip", cascade="all, delete-orphan")
    itinerary_items = relationship("ItineraryItem", back_populates="trip", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="trip")

class Destination(Base):
    __tablename__ = "destinations"

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text)
    # PostGIS Geometry type for coordinates (Point)
    coordinate = Column(Geometry('POINT', srid=4326)) 
    
    trip = relationship("Trip", back_populates="destinations")

    @property
    def lat(self):
        from geoalchemy2.shape import to_shape
        if self.coordinate is not None:
            return to_shape(self.coordinate).y
        return None

    @property
    def lon(self):
        from geoalchemy2.shape import to_shape
        if self.coordinate is not None:
            return to_shape(self.coordinate).x
        return None

class ItineraryItem(Base):
    __tablename__ = "itinerary_items"

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"), nullable=False)
    day_number = Column(Integer)
    title = Column(String)
    description = Column(Text)

    trip = relationship("Trip", back_populates="itinerary_items")

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    trip_id = Column(Integer, ForeignKey("trips.id"), nullable=False)
    status = Column(String, default=BookingStatus.PENDING)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    total_price = Column(DECIMAL(10, 2))

    user = relationship("User", back_populates="bookings")
    trip = relationship("Trip", back_populates="bookings")

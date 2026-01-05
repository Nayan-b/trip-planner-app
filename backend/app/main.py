from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, trips, bookings
from .database import engine, Base

# Create tables if not managed by Alembic? 
# Usually we let Alembic handle it. 
# Base.metadata.create_all(bind=engine) 

app = FastAPI(title="Trip Planner API")

# Update allow_origins with frontend URL
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(trips.router)
app.include_router(bookings.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Trip Planner API"}

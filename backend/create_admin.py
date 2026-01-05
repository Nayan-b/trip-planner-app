import sys
import os

# Ensure /app is in path (it should be by default in Docker)
sys.path.append(os.getcwd())

from app.database import SessionLocal
from app import models, security

def create_admin():
    db = SessionLocal()
    try:
        email = "admin@email.com"
        password = "admin-2026"
        full_name = "Ram Paudel"
        
        print(f"Checking for user {email}...")
        user = db.query(models.User).filter(models.User.email == email).first()
        
        if user:
            print(f"User {email} exists. Updating details and setting as admin...")
            user.full_name = full_name
            user.is_admin = True
            user.hashed_password = security.get_password_hash(password)
        else:
            print(f"Creating new admin user {email}...")
            hashed_password = security.get_password_hash(password)
            user = models.User(
                email=email,
                full_name=full_name,
                hashed_password=hashed_password,
                is_admin=True
            )
            db.add(user)
        
        db.commit()
        print("Admin user created/updated successfully.")
    except Exception as e:
        print(f"Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()

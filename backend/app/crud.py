from sqlalchemy.orm import Session
from . import models, schemas
from .routers.auth import get_password_hash
import uuid

# --- User CRUD ---

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        id=uuid.uuid4(),
        email=user.email,
        password=hashed_password,
        fullName=user.fullName,
        role="admin" if "admin" in user.email else "user"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- Chart CRUD ---

def get_charts_by_user(db: Session, user_id: uuid.UUID):
    return db.query(models.Chart).filter(models.Chart.userId == user_id).all()

def create_chart(db: Session, chart: schemas.ChartCreate, user_id: uuid.UUID):
    db_chart = models.Chart(
        **chart.dict(),
        id=uuid.uuid4(),
        userId=user_id
    )
    db.add(db_chart)
    db.commit()
    db.refresh(db_chart)
    return db_chart


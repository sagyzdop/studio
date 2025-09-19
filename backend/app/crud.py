from sqlalchemy.orm import Session
from . import models, schemas
from .routers.auth import get_password_hash
import uuid


# --- Chart CRUD ---

def get_charts(db: Session):
    return db.query(models.Chart).all()

def get_charts_by_user(db: Session, user_id: uuid.UUID):
    return db.query(models.Chart).filter(models.Chart.userId == user_id).all()

def create_chart(db: Session, chart: schemas.ChartCreate):
    db_chart = models.Chart(
        **chart.dict()
    ).query(models.Chart).all()
    db.add(db_chart)
    db.commit()
    db.refresh(db_chart)
    return db_chart


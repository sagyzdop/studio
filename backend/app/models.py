from sqlalchemy import Column, String, DateTime, ForeignKey
from .database import Base
from sqlalchemy import Integer # Import Integer

class Chart(Base):
    __tablename__ = "charts"

    chart_id = Column(Integer, primary_key=True) # Changed to Integer and removed default UUID
    title = Column(String, nullable=False)
    sqlQuery = Column(String, nullable=False)
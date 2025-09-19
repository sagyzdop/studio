from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .database import Base
import uuid
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    fullName = Column(String)
    role = Column(String, nullable=False, default='user')

    charts = relationship("Chart", back_populates="owner")

class Chart(Base):
    __tablename__ = "charts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    userId = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    sqlQuery = Column(String, nullable=False)
    chartType = Column(String, nullable=False)
    createdAt = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="charts")


from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    fullName: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    role: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class ChartBase(BaseModel):
    title: str
    sqlQuery: str
    chartType: str

class ChartCreate(ChartBase):
    data: List[Any]

class Chart(ChartBase):
    id: str
    userId: str
    createdAt: datetime
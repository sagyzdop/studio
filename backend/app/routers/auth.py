from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from passlib.context import CryptContext
import uuid
import os

from .. import schemas
from ..database import execute_d1_query

SECRET_KEY = os.getenv("SECRET_KEY", "a_default_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/register")
async def register(user: schemas.UserCreate):
    existing_user = await execute_d1_query("SELECT id FROM users WHERE email = ?1", [user.email])
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user.password)
    user_id = str(uuid.uuid4())
    # For simplicity, derive fullName from email if not provided
    full_name = user.fullName if user.fullName else user.email.split('@')[0]
    role = "admin" if "admin" in user.email else "user"

    await execute_d1_query(
        "INSERT INTO users (id, email, password, fullName, role) VALUES (?1, ?2, ?3, ?4, ?5)",
        [user_id, user.email, hashed_password, full_name, role]
    )
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/token", response_model=schemas.Token)
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user_data = await execute_d1_query("SELECT * FROM users WHERE email = ?1", [form_data.username])
    if not user_data or not verify_password(form_data.password, user_data[0]['password']):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": user_data[0]['email']})
    return {"access_token": access_token, "token_type": "bearer"}
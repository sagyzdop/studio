from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from .routers import dashboard, ai

import json

from .websockets import manager, websocket_router
from .routers import auth, dashboard

app = FastAPI(title="Corporate Data Lens API")
app.include_router(ai.router)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(dashboard.router)


@app.get("/")
def read_root():
    return {"message": "Welcome to the Corporate Data Lens API"}
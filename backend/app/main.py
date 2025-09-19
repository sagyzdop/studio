from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, dashboard, ai

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
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(websocket_router)


@app.post("/api/chatbot-response")
async def receive_chatbot_response(request: Request):
    """
    Webhook to receive data from the AI chatbot and broadcast it.
    """
    try:
        data = await request.json()
        await manager.broadcast(json.dumps(data))
        return {"status": "data received and broadcasted"}
    except json.JSONDecodeError:
        return {"status": "error", "message": "Invalid JSON"}, 400


@app.get("/")
def read_root():
    return {"message": "Welcome to the Corporate Data Lens API"}
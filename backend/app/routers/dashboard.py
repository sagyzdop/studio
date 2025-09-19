from fastapi import APIRouter, Depends, HTTPException
from typing import List, Annotated
import uuid
from datetime import datetime, timezone

from .. import schemas
from .auth import get_current_user
from ..database import execute_d1_query

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"], dependencies=[Depends(get_current_user)])

@router.get("/charts", response_model=List[schemas.Chart])
async def get_dashboard_charts(current_user: Annotated[schemas.User, Depends(get_current_user)]):
    user_id = current_user['id']
    return await execute_d1_query("SELECT * FROM charts WHERE userId = ?1", [user_id])

@router.post("/charts", response_model=schemas.Chart, status_code=201)
async def add_chart_to_dashboard(chart_data: schemas.ChartCreate, current_user: Annotated[schemas.User, Depends(get_current_user)]):
    chart_id = str(uuid.uuid4())
    created_at = datetime.now(timezone.utc)
    
    await execute_d1_query(
        "INSERT INTO charts (id, userId, title, sqlQuery, chartType, createdAt) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        [chart_id, current_user['id'], chart_data.title, chart_data.sqlQuery, chart_data.chartType, created_at.isoformat()]
    )
    return {**chart_data.dict(), "id": chart_id, "userId": current_user['id'], "createdAt": created_at}
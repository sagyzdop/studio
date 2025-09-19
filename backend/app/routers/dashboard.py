from fastapi import APIRouter, HTTPException
from typing import List, Any
import uuid

from .. import schemas
from ..database import execute_d1_query

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/charts", response_model=List[schemas.Chart])
async def get_dashboard_charts():
    return await execute_d1_query("SELECT id, title, sqlQuery FROM charts")

@router.post("/charts", response_model=schemas.Chart, status_code=201)
async def add_chart_to_dashboard(chart_data: schemas.ChartCreate):
    import random
    chart_id = random.randint(1000, 9999)
    
    await execute_d1_query(
        "INSERT INTO charts (id, title, sqlQuery) VALUES (?1, ?2, ?3)",
        [chart_id, chart_data.title, chart_data.sqlQuery]
    )
    return {**chart_data.dict(), "id": chart_id}

@router.get("/charts/{chart_id}/data", response_model=List[Any])
async def get_chart_data(chart_id: int):
    chart_query_result = await execute_d1_query(
        "SELECT sqlQuery FROM charts WHERE id = ?1", [chart_id]
    )
    if not chart_query_result:
        raise HTTPException(status_code=404, detail="Chart not found")

    sql_query = chart_query_result[0]['sqlQuery']

    try:
        chart_data = await execute_d1_query(sql_query)
        return chart_data
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error executing chart query: {str(e)}")
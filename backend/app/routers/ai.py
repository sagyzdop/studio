from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Any

router = APIRouter(prefix="/api/ai", tags=["AI"])

class ChartSuggestionRequest(BaseModel):
    data: List[Any]

@router.post("/suggest-chart-type")
async def suggest_chart_type(request: ChartSuggestionRequest):
    """
    Analyzes data and suggests a suitable chart type.
    This is a placeholder for your Genkit flow.
    """
    data = request.data

    if not data:
        return {"chartType": "table", "reason": "No data was provided."}

    # Basic logic to suggest a chart type
    try:
        keys = data[0].keys()
        string_keys = [k for k, v in data[0].items() if isinstance(v, str)]
        numeric_keys = [k for k, v in data[0].items() if isinstance(v, (int, float))]

        if len(string_keys) >= 1 and len(numeric_keys) >= 1:
            if len(data) <= 8:
                return {"chartType": "bar", "reason": "A bar chart is effective for comparing a small number of categories."}
            else:
                return {"chartType": "line", "reason": "A line chart is good for showing trends over many data points."}
        elif len(numeric_keys) >= 2:
            return {"chartType": "scatter", "reason": "A scatter plot can show the relationship between two numeric variables."}

    except (IndexError, AttributeError):
        # Data might be empty or not in the expected format
        pass

    return {"chartType": "table", "reason": "The data structure is best displayed as a table."}

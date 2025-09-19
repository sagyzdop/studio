import httpx
import os
from fastapi import HTTPException
from dotenv import load_dotenv

load_dotenv()

CLOUDFLARE_API_TOKEN = os.getenv("CLOUDFLARE_API_TOKEN")
CLOUDFLARE_ACCOUNT_ID = os.getenv("CLOUDFLARE_ACCOUNT_ID")
DATABASE_ID = os.getenv("DATABASE_ID")

if not all([CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, DATABASE_ID]):
    print("Warning: Cloudflare D1 credentials are not fully configured.")

D1_API_URL = f"https://api.cloudflare.com/client/v4/accounts/{CLOUDFLARE_ACCOUNT_ID}/d1/database/{DATABASE_ID}/query"

async def execute_d1_query(sql: str, params: list = []):
    if not all([CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, DATABASE_ID]):
         raise HTTPException(status_code=500, detail="Database credentials not configured.")

    headers = {"Authorization": f"Bearer {CLOUDFLARE_API_TOKEN}"}
    data = {"sql": sql, "params": params}

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(D1_API_URL, headers=headers, json=data, timeout=30.0)
            response.raise_for_status()
            api_response = response.json()
            if api_response.get("success") and "results" in api_response:
                return api_response["results"]
            else:
                print("Cloudflare D1 API Error:", api_response.get("errors"))
                raise HTTPException(status_code=500, detail="Failed to execute query.")
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"D1 API Error: {e.response.text}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
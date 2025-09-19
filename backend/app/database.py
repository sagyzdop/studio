import httpx
import os
from fastapi import HTTPException
from dotenv import load_dotenv

load_dotenv()

# --- D1 Configuration ---
CLOUDFLARE_API_TOKEN = os.getenv("CLOUDFLARE_API_TOKEN")
CLOUDFLARE_ACCOUNT_ID = os.getenv("CLOUDFLARE_ACCOUNT_ID")
DATABASE_ID = os.getenv("DATABASE_ID")

if not all([CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, DATABASE_ID]):
    print("Warning: Cloudflare D1 credentials are not fully configured in the environment.")

D1_API_URL = f"https://api.cloudflare.com/client/v4/accounts/{CLOUDFLARE_ACCOUNT_ID}/d1/database/{DATABASE_ID}/query"

async def execute_d1_query(sql: str, params: list = []):
    """Executes a query against the Cloudflare D1 database."""
    if not all([CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, DATABASE_ID]):
        raise HTTPException(status_code=500, detail="Database credentials are not configured on the server.")

    headers = {"Authorization": f"Bearer {CLOUDFLARE_API_TOKEN}"}
    data = {"sql": sql, "params": params}

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(D1_API_URL, headers=headers, json=data, timeout=30.0)
            response.raise_for_status()
            api_response = response.json()
            
            # The structure from your example shows results are nested
            if api_response.get("success") and api_response.get("result"):
                 query_result = api_response["result"][0]
                 if query_result.get("success"):
                     return query_result.get("results", [])
            
            # If we reach here, something went wrong.
            print("Cloudflare D1 API Error:", api_response.get("errors"))
            raise HTTPException(status_code=500, detail="Failed to execute D1 query.")

        except httpx.HTTPStatusError as e:
            print(f"D1 API HTTP Error: {e.response.text}")
            raise HTTPException(status_code=e.response.status_code, detail=f"D1 API Error: {e.response.text}")
        except Exception as e:
            print(f"Internal Server Error during D1 query: {e}")
            raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")

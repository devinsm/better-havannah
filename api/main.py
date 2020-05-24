from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import datetime
import os

from .environment import flag_is_set

app = FastAPI()

class CurrentTime(BaseModel):
    value: datetime.datetime

# Just used to check that API reachable
@app.get("/api/get-time")
async def root():
    return {
        "value": datetime.datetime.now()
    }

if flag_is_set("SINGLE_SERVER_SETUP"):
    app.mount("/", StaticFiles(directory="build", html=True), name="react-app")

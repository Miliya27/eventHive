from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for hackathon demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


# ---------- TEST ----------
@app.get("/")
def home():
    return {"message": "Backend working 🚀"}


# ---------- STUDENT SIGNUP ----------
@app.post("/signup")
def signup(data: dict):

    supabase.table("students").insert({
        "name": data["name"],
        "email": data["email"],
        "branch": data["branch"],
        "semester": data["semester"],
        "password_hash": data["password"]
    }).execute()

    return {"message": "Student created"}

@app.post("/login")
def login(data: dict):

    if data["email"] == "admin@college.edu" and data["password"] == "Admin@2024":
        return {
            "id": 0,
            "name": "Admin",
            "email": "admin@college.edu",
            "role": "admin"
        }
    
    result = supabase.table("students") \
        .select("*") \
        .eq("email", data["email"]) \
        .execute()

    if not result.data:
        return {"error": "User not found"}

    user = result.data[0]

    if user["password_hash"] != data["password"]:
        return {"error": "Invalid password"}

    return {
        "id": user.get("id"),
        "name": user.get("email").split("@")[0],
        "email": user.get("email"),
        "branch": user.get("branch"),
        "semester": user.get("semester")
    }
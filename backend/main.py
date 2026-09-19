from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from fitness import calculate_bmi, calculate_calories
from workout import workout_summary
from diet import generate_diet_plan
from habit import calculate_habit_status
from chatbot import fitness_chat

app = FastAPI(
    title="AI Gym & Fitness Assistant",
    description="AI-powered fitness assistant",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://ai-fitness-assistant-tau.vercel.app"
],
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class BMIRequest(BaseModel):
    weight_kg: float
    height_cm: float


class CalorieRequest(BaseModel):
    age: int
    weight_kg: float
    height_cm: float
    gender: str
    activity_level: str
    goal: str

class WorkoutRequest(BaseModel):
    exercise: str
    reps: int
    correct_reps: int
    target_reps: int

class DietRequest(BaseModel):
    goal: str
    diet_preference: str
    daily_calories: int

class HabitRequest(BaseModel):
    workouts_completed: int
    workouts_planned: int
    current_streak: int

class ChatRequest(BaseModel):
    message: str


@app.get("/")
def home():
    return {
        "message": "AI Gym & Fitness Assistant API is running!",
        "status": "success"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.post("/bmi")
def bmi(request: BMIRequest):
    return calculate_bmi(
        request.weight_kg,
        request.height_cm
    )


@app.post("/calories")
def calories(request: CalorieRequest):
    return calculate_calories(
        request.age,
        request.weight_kg,
        request.height_cm,
        request.gender,
        request.activity_level,
        request.goal
    )

@app.post("/workout")
def workout(request: WorkoutRequest):
    return workout_summary(
        request.exercise,
        request.reps,
        request.correct_reps,
        request.target_reps
    )

@app.post("/diet")
def diet(request: DietRequest):
    return generate_diet_plan(
        request.goal,
        request.diet_preference,
        request.daily_calories
    )

@app.post("/habit")
def habit(request: HabitRequest):
    return calculate_habit_status(
        request.workouts_completed,
        request.workouts_planned,
        request.current_streak
    )

@app.post("/chat")
def chat(request: ChatRequest):
    return fitness_chat(request.message)
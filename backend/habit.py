def calculate_habit_status(
    workouts_completed: int,
    workouts_planned: int,
    current_streak: int
):
    if workouts_planned <= 0:
        completion_rate = 0
    else:
        completion_rate = (
            workouts_completed / workouts_planned
        ) * 100

    if completion_rate >= 80:
        status = "Excellent"
        message = "Amazing consistency! Keep it going."
    elif completion_rate >= 50:
        status = "Good"
        message = "You're making progress. Stay consistent!"
    else:
        status = "Needs Improvement"
        message = "Try to schedule your next workout."

    return {
        "workouts_completed": workouts_completed,
        "workouts_planned": workouts_planned,
        "completion_rate": round(completion_rate, 2),
        "current_streak": current_streak,
        "status": status,
        "message": message
    }
def calculate_performance_score(
    reps: int,
    correct_reps: int,
    target_reps: int
):
    if reps <= 0:
        return {
            "score": 0,
            "feedback": "Start your workout!"
        }

    form_accuracy = correct_reps / reps

    rep_score = min(reps / target_reps, 1) * 50
    form_score = form_accuracy * 50

    score = round(rep_score + form_score)

    if score >= 90:
        feedback = "Excellent performance!"
    elif score >= 75:
        feedback = "Great job! Keep going."
    elif score >= 50:
        feedback = "Good effort. Focus on your form."
    else:
        feedback = "Keep practicing and improve your form."

    return {
        "score": score,
        "form_accuracy": round(form_accuracy * 100, 2),
        "feedback": feedback
    }


def workout_summary(
    exercise: str,
    reps: int,
    correct_reps: int,
    target_reps: int
):
    performance = calculate_performance_score(
        reps,
        correct_reps,
        target_reps
    )

    return {
        "exercise": exercise,
        "total_reps": reps,
        "correct_reps": correct_reps,
        "target_reps": target_reps,
        **performance
    }
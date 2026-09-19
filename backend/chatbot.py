def fitness_chat(message: str):
    text = message.lower()

    if any(word in text for word in ["motivate", "motivation", "lazy"]):
        response = (
            "You don't need to be perfect. "
            "Just start with one workout today. "
            "Small steps create big results!"
        )

    elif any(word in text for word in ["workout", "exercise", "training"]):
        response = (
            "A balanced workout can include strength training, "
            "cardio and recovery. Start at a comfortable intensity "
            "and focus on proper form."
        )

    elif any(word in text for word in ["diet", "food", "eat"]):
        response = (
            "Focus on balanced meals containing protein, "
            "vegetables, whole grains and healthy fats. "
            "Your calorie target should match your fitness goal."
        )

    elif any(word in text for word in ["tired", "rest", "recovery"]):
        response = (
            "Recovery is an important part of fitness. "
            "Consider taking a rest day and getting adequate sleep."
        )

    elif any(word in text for word in ["hello", "hi", "hey"]):
        response = (
            "Hey! I'm your AI Gym Buddy. "
            "Ask me about workouts, diet, motivation or recovery."
        )

    else:
        response = (
            "I'm here to help with workouts, diet, motivation "
            "and recovery. What would you like to work on?"
        )

    return {
        "message": message,
        "response": response
    }
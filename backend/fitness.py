def calculate_bmi(weight_kg: float, height_cm: float):
    height_m = height_cm / 100

    bmi = weight_kg / (height_m ** 2)

    if bmi < 18.5:
        category = "Underweight"
    elif bmi < 25:
        category = "Normal weight"
    elif bmi < 30:
        category = "Overweight"
    else:
        category = "Obese"

    return {
        "bmi": round(bmi, 2),
        "category": category
    }


def calculate_calories(
    age: int,
    weight_kg: float,
    height_cm: float,
    gender: str,
    activity_level: str,
    goal: str
):
    if gender.lower() == "male":
        bmr = (
            10 * weight_kg
            + 6.25 * height_cm
            - 5 * age
            + 5
        )
    else:
        bmr = (
            10 * weight_kg
            + 6.25 * height_cm
            - 5 * age
            - 161
        )

    activity_multipliers = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very_active": 1.9
    }

    multiplier = activity_multipliers.get(
        activity_level.lower(),
        1.2
    )

    maintenance = bmr * multiplier

    if goal.lower() == "lose":
        target = maintenance - 500
    elif goal.lower() == "gain":
        target = maintenance + 300
    else:
        target = maintenance

    return {
        "bmr": round(bmr),
        "maintenance_calories": round(maintenance),
        "target_calories": round(target)
    }
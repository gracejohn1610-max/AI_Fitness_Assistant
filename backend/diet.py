def generate_diet_plan(
    goal: str,
    diet_preference: str,
    daily_calories: int
):
    diet_preference = diet_preference.lower()
    goal = goal.lower()

    plans = {
        "vegetarian": {
            "breakfast": "Oats with milk, banana and almonds",
            "lunch": "Brown rice, dal, mixed vegetables and curd",
            "snack": "Greek yogurt with fruit",
            "dinner": "Paneer, roti and vegetable salad"
        },
        "non-vegetarian": {
            "breakfast": "Eggs, whole wheat toast and fruit",
            "lunch": "Grilled chicken, brown rice and vegetables",
            "snack": "Greek yogurt and nuts",
            "dinner": "Grilled fish, roti and salad"
        },
        "vegan": {
            "breakfast": "Oatmeal with soy milk, banana and nuts",
            "lunch": "Chickpea bowl with brown rice and vegetables",
            "snack": "Fruit and mixed nuts",
            "dinner": "Tofu, quinoa and mixed vegetables"
        }
    }

    plan = plans.get(
        diet_preference,
        plans["vegetarian"]
    )

    grocery_list = [
        "Oats",
        "Bananas",
        "Mixed vegetables",
        "Brown rice",
        "Nuts",
        "Fresh fruits"
    ]

    if diet_preference == "vegetarian":
        grocery_list.extend([
            "Paneer",
            "Curd",
            "Dal"
        ])

    elif diet_preference == "non-vegetarian":
        grocery_list.extend([
            "Eggs",
            "Chicken",
            "Fish"
        ])

    elif diet_preference == "vegan":
        grocery_list.extend([
            "Tofu",
            "Soy milk",
            "Chickpeas"
        ])

    return {
        "goal": goal,
        "diet_preference": diet_preference,
        "daily_calories": daily_calories,
        "meal_plan": plan,
        "grocery_list": grocery_list
    }
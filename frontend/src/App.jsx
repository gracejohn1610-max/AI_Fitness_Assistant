import { useState } from "react";
import axios from "axios";
import {
  Activity,
  Dumbbell,
  Apple,
  MessageCircle,
  Flame,
  Calculator,
  Send,
  HeartPulse,
} from "lucide-react";
import "./App.css";
import WorkoutCamera from "./WorkoutCamera";

const API = "http://127.0.0.1:8000";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  const [bmiData, setBmiData] = useState(null);
  const [bmiForm, setBmiForm] = useState({
    weight_kg: "",
    height_cm: "",
  });

  const [calorieData, setCalorieData] = useState(null);
  const [calorieForm, setCalorieForm] = useState({
    age: "",
    weight_kg: "",
    height_cm: "",
    gender: "male",
    activity_level: "moderate",
    goal: "maintain",
  });

  const [chatMessage, setChatMessage] = useState("");
  const [chatResponse, setChatResponse] = useState(
    "Hi! I'm your AI Gym Buddy. Ask me about workouts, diet, motivation or recovery."
  );

  const [workoutData, setWorkoutData] = useState(null);
  const [workoutForm, setWorkoutForm] = useState({
    exercise: "Squat",
    reps: "",
    correct_reps: "",
    target_reps: "",
  });

  const [dietData, setDietData] = useState(null);
  const [dietForm, setDietForm] = useState({
    goal: "lose",
    diet_preference: "vegetarian",
    daily_calories: 2000,
  });

  const [habitData, setHabitData] = useState(null);
  const [habitForm, setHabitForm] = useState({
    workouts_completed: "",
    workouts_planned: "",
    current_streak: "",
  });

  const calculateBMI = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API}/bmi`, {
        weight_kg: Number(bmiForm.weight_kg),
        height_cm: Number(bmiForm.height_cm),
      });

      setBmiData(response.data);
    } catch (error) {
      alert("Could not connect to the backend.");
    }
  };

  const calculateCalories = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API}/calories`, {
        age: Number(calorieForm.age),
        weight_kg: Number(calorieForm.weight_kg),
        height_cm: Number(calorieForm.height_cm),
        gender: calorieForm.gender,
        activity_level: calorieForm.activity_level,
        goal: calorieForm.goal,
      });

      setCalorieData(response.data);
    } catch (error) {
      alert("Could not connect to the backend.");
    }
  };

  const calculateWorkout = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API}/workout`, {
        exercise: workoutForm.exercise,
        reps: Number(workoutForm.reps),
        correct_reps: Number(workoutForm.correct_reps),
        target_reps: Number(workoutForm.target_reps),
      });

      setWorkoutData(response.data);
    } catch (error) {
      alert("Could not connect to the backend.");
    }
  };

  const generateDiet = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API}/diet`, {
        goal: dietForm.goal,
        diet_preference: dietForm.diet_preference,
        daily_calories: Number(dietForm.daily_calories),
      });

      setDietData(response.data);
    } catch (error) {
      alert("Could not connect to the backend.");
    }
  };

  const calculateHabit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API}/habit`, {
        workouts_completed: Number(habitForm.workouts_completed),
        workouts_planned: Number(habitForm.workouts_planned),
        current_streak: Number(habitForm.current_streak),
      });

      setHabitData(response.data);
    } catch (error) {
      alert("Could not connect to the backend.");
    }
  };

  const sendChat = async (e) => {
    e.preventDefault();

    if (!chatMessage.trim()) return;

    try {
      const response = await axios.post(`${API}/chat`, {
        message: chatMessage,
      });

      setChatResponse(response.data.response);
      setChatMessage("");
    } catch (error) {
      alert("Could not connect to the backend.");
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: Activity },
    { name: "Workout", icon: Dumbbell },
    { name: "Dietician", icon: Apple },
    { name: "AI Gym Buddy", icon: MessageCircle },
    { name: "Habits", icon: Flame },
  ];

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <HeartPulse size={30} />
          <span>FitAI</span>
        </div>

        <p className="sidebar-title">FITNESS AI</p>

        <nav>
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`nav-item ${
                  activePage === item.name ? "active" : ""
                }`}
                onClick={() => setActivePage(item.name)}
              >
                <Icon size={20} />
                {item.name}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="status-dot"></div>
          <span>AI System Online</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="welcome">Welcome back 👋</p>
            <h1>{activePage}</h1>
          </div>

          <div className="profile">
            <div className="profile-avatar">U</div>
            <div>
              <strong>Fitness User</strong>
              <span>AI Fitness Member</span>
            </div>
          </div>
        </header>

        {activePage === "Dashboard" && (
          <>
            <section className="hero">
              <div>
                <p className="hero-label">YOUR AI FITNESS ASSISTANT</p>
                <h2>Train smarter.<br />Live healthier.</h2>
                <p>
                  Track your fitness, calculate your health metrics,
                  plan your diet and chat with your AI Gym Buddy.
                </p>
              </div>

              <div className="hero-icon">
                <Dumbbell size={90} />
              </div>
            </section>

            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <Calculator />
                </div>
                <span>BMI</span>
                <strong>{bmiData ? bmiData.bmi : "--"}</strong>
                <small>
                  {bmiData ? bmiData.category : "Calculate your BMI"}
                </small>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Flame />
                </div>
                <span>Daily Calories</span>
                <strong>
                  {calorieData ? calorieData.target_calories : "--"}
                </strong>
                <small>Target calories</small>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Dumbbell />
                </div>
                <span>Workout Score</span>
                <strong>
                  {workoutData ? workoutData.score : "--"}
                </strong>
                <small>Performance score</small>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Activity />
                </div>
                <span>Current Streak</span>
                <strong>
                  {habitData ? habitData.current_streak : "--"}
                </strong>
                <small>Workout days</small>
              </div>
            </section>

            <section className="dashboard-grid">
              <div className="panel">
                <div className="panel-header">
                  <div>
                    <h3>BMI Calculator</h3>
                    <p>Check your body mass index</p>
                  </div>
                  <Calculator />
                </div>

                <form onSubmit={calculateBMI} className="form">
                  <input
                    type="number"
                    placeholder="Weight (kg)"
                    value={bmiForm.weight_kg}
                    onChange={(e) =>
                      setBmiForm({
                        ...bmiForm,
                        weight_kg: e.target.value,
                      })
                    }
                    required
                  />

                  <input
                    type="number"
                    placeholder="Height (cm)"
                    value={bmiForm.height_cm}
                    onChange={(e) =>
                      setBmiForm({
                        ...bmiForm,
                        height_cm: e.target.value,
                      })
                    }
                    required
                  />

                  <button type="submit">Calculate BMI</button>
                </form>

                {bmiData && (
                  <div className="result">
                    <strong>BMI: {bmiData.bmi}</strong>
                    <span>{bmiData.category}</span>
                  </div>
                )}
              </div>

              <div className="panel">
                <div className="panel-header">
                  <div>
                    <h3>AI Gym Buddy</h3>
                    <p>Your personal fitness chatbot</p>
                  </div>
                  <MessageCircle />
                </div>

                <div className="chat-box">
                  <div className="bot-message">{chatResponse}</div>
                </div>

                <form onSubmit={sendChat} className="chat-form">
                  <input
                    type="text"
                    placeholder="Ask your AI Gym Buddy..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                  />
                  <button type="submit">
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </section>
          </>
        )}

        {activePage === "Workout" && (
          <section className="page-section">
            <div className="section-heading">
              <Dumbbell size={30} />
              <div>
                <h2>AI Workout Analyzer</h2>
                <p>Analyze reps and workout form performance.</p>
              </div>
            </div>

            <div className="panel large-panel">
              <form onSubmit={calculateWorkout} className="form">
                <input
                  type="text"
                  placeholder="Exercise"
                  value={workoutForm.exercise}
                  onChange={(e) =>
                    setWorkoutForm({
                      ...workoutForm,
                      exercise: e.target.value,
                    })
                  }
                  required
                />

                <input
                  type="number"
                  placeholder="Total reps"
                  value={workoutForm.reps}
                  onChange={(e) =>
                    setWorkoutForm({
                      ...workoutForm,
                      reps: e.target.value,
                    })
                  }
                  required
                />

                <input
                  type="number"
                  placeholder="Correct reps"
                  value={workoutForm.correct_reps}
                  onChange={(e) =>
                    setWorkoutForm({
                      ...workoutForm,
                      correct_reps: e.target.value,
                    })
                  }
                  required
                />

                <input
                  type="number"
                  placeholder="Target reps"
                  value={workoutForm.target_reps}
                  onChange={(e) =>
                    setWorkoutForm({
                      ...workoutForm,
                      target_reps: e.target.value,
                    })
                  }
                  required
                />

                <button type="submit">Analyze Workout</button>
              </form>

              {workoutData && (
                <div className="result workout-result">
                  <h3>{workoutData.exercise}</h3>
                  <strong>{workoutData.score}/100</strong>
                  <span>
                    Form accuracy: {workoutData.form_accuracy}%
                  </span>
                  <p>{workoutData.feedback}</p>
                </div>
              )}

              <WorkoutCamera />
              </div>
          </section>
        )}

        {activePage === "Dietician" && (
          <section className="page-section">
            <div className="section-heading">
              <Apple size={30} />
              <div>
                <h2>AI Dietician</h2>
                <p>Generate a personalized meal plan and grocery list.</p>
              </div>
            </div>

            <div className="panel large-panel">
              <form onSubmit={generateDiet} className="form">
                <select
                  value={dietForm.goal}
                  onChange={(e) =>
                    setDietForm({
                      ...dietForm,
                      goal: e.target.value,
                    })
                  }
                >
                  <option value="lose">Lose Weight</option>
                  <option value="maintain">Maintain Weight</option>
                  <option value="gain">Gain Weight</option>
                </select>

                <select
                  value={dietForm.diet_preference}
                  onChange={(e) =>
                    setDietForm({
                      ...dietForm,
                      diet_preference: e.target.value,
                    })
                  }
                >
                  <option value="vegetarian">Vegetarian</option>
                  <option value="non-vegetarian">Non-Vegetarian</option>
                  <option value="vegan">Vegan</option>
                </select>

                <input
                  type="number"
                  placeholder="Daily calories"
                  value={dietForm.daily_calories}
                  onChange={(e) =>
                    setDietForm({
                      ...dietForm,
                      daily_calories: e.target.value,
                    })
                  }
                  required
                />

                <button type="submit">Generate Diet Plan</button>
              </form>

              {dietData && (
                <div className="diet-result">
                  <h3>Meal Plan</h3>

                  <div className="meal-grid">
                    {Object.entries(dietData.meal_plan).map(
                      ([meal, food]) => (
                        <div className="meal-card" key={meal}>
                          <strong>{meal}</strong>
                          <p>{food}</p>
                        </div>
                      )
                    )}
                  </div>

                  <h3>Grocery List</h3>

                  <div className="grocery-list">
                    {dietData.grocery_list.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {activePage === "AI Gym Buddy" && (
          <section className="page-section">
            <div className="section-heading">
              <MessageCircle size={30} />
              <div>
                <h2>AI Gym Buddy</h2>
                <p>Your conversational fitness assistant.</p>
              </div>
            </div>

            <div className="panel chatbot-panel">
              <div className="chat-large">
                <div className="bot-message">{chatResponse}</div>
              </div>

              <form onSubmit={sendChat} className="chat-form">
                <input
                  type="text"
                  placeholder="Ask about workouts, diet, motivation..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                />
                <button type="submit">
                  <Send size={18} />
                </button>
              </form>
            </div>
          </section>
        )}

        {activePage === "Habits" && (
          <section className="page-section">
            <div className="section-heading">
              <Flame size={30} />
              <div>
                <h2>Fitness Habit Tracker</h2>
                <p>Track consistency and workout streaks.</p>
              </div>
            </div>

            <div className="panel large-panel">
              <form onSubmit={calculateHabit} className="form">
                <input
                  type="number"
                  placeholder="Workouts completed"
                  value={habitForm.workouts_completed}
                  onChange={(e) =>
                    setHabitForm({
                      ...habitForm,
                      workouts_completed: e.target.value,
                    })
                  }
                  required
                />

                <input
                  type="number"
                  placeholder="Workouts planned"
                  value={habitForm.workouts_planned}
                  onChange={(e) =>
                    setHabitForm({
                      ...habitForm,
                      workouts_planned: e.target.value,
                    })
                  }
                  required
                />

                <input
                  type="number"
                  placeholder="Current streak"
                  value={habitForm.current_streak}
                  onChange={(e) =>
                    setHabitForm({
                      ...habitForm,
                      current_streak: e.target.value,
                    })
                  }
                  required
                />

                <button type="submit">Analyze Habits</button>
              </form>

              {habitData && (
                <div className="result">
                  <strong>{habitData.status}</strong>
                  <span>
                    Completion rate: {habitData.completion_rate}%
                  </span>
                  <p>{habitData.message}</p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
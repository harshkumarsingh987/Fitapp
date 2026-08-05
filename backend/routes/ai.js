const express = require("express");
const fetch = require("node-fetch");
const authMiddleware = require("../middleware/auth");
const User = require("../models/User");
const Workout = require("../models/Workout");

const router = express.Router();
router.use(authMiddleware);

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent";

async function askGemini(prompt) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("NO_KEY");
  }
  const response = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    console.error("Gemini error:", data);
    throw new Error("GEMINI_ERROR");
  }
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't come up with a tip right now.";
}

// @route  POST /api/ai/coach   body: { question? }  -> personalized tip or answer
router.post("/coach", async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const recentWorkouts = await Workout.find({ user: req.userId }).sort({ date: -1 }).limit(7);

    const bmi =
      user.heightCm && user.weightKg
        ? Math.round((user.weightKg / (user.heightCm / 100) ** 2) * 10) / 10
        : null;

    const context = `
You are a friendly, encouraging fitness coach inside a fitness tracker app.
User profile: age ${user.age || "unknown"}, gender ${user.gender || "unknown"}, height ${
      user.heightCm || "unknown"
    }cm, weight ${user.weightKg || "unknown"}kg, BMI ${bmi ?? "unknown"}, goal: ${
      user.goal || "general fitness"
    }.
Daily goals: ${user.dailyStepGoal} steps, ${user.dailyCalorieGoal} kcal, ${user.dailyWaterGoalMl}ml water.
Last ${recentWorkouts.length} workouts: ${recentWorkouts
      .map((w) => `${w.type} (${w.durationMin}min, ${w.caloriesBurned}kcal)`)
      .join(", ") || "no workouts logged yet"}.

${req.body.question ? `The user asks: "${req.body.question}"` : "Give the user one short, specific, motivating tip for today based on their recent activity."}
Keep the reply under 120 words, warm in tone, and practical. Do not use markdown headers.
`;

    const text = await askGemini(context);
    res.json({ reply: text });
  } catch (err) {
    if (err.message === "NO_KEY") {
      return res.json({
        reply:
          "AI coach isn't configured yet — add a free GEMINI_API_KEY from https://aistudio.google.com/app/apikey to your backend .env to enable personalized tips.",
      });
    }
    console.error(err);
    res.status(500).json({ reply: "The AI coach is taking a break — please try again shortly." });
  }
});

module.exports = router;

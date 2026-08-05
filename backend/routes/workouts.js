const express = require("express");
const Workout = require("../models/Workout");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
router.use(authMiddleware);

// @route  GET /api/workouts  (list, most recent first)
router.get("/", async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.userId }).sort({ date: -1 }).limit(200);
    res.json({ workouts });
  } catch (err) {
    res.status(500).json({ message: "Could not load workouts" });
  }
});

// @route  POST /api/workouts
router.post("/", async (req, res) => {
  try {
    const { type, title, durationMin, caloriesBurned, distanceKm, steps, waterMl, notes, date } =
      req.body;

    if (!type || !title || !durationMin) {
      return res.status(400).json({ message: "Type, title and duration are required" });
    }

    const workout = await Workout.create({
      user: req.userId,
      type,
      title,
      durationMin,
      caloriesBurned,
      distanceKm,
      steps,
      waterMl,
      notes,
      date: date || Date.now(),
    });
    res.status(201).json({ workout });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not save workout" });
  }
});

// @route  DELETE /api/workouts/:id
router.delete("/:id", async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!workout) return res.status(404).json({ message: "Workout not found" });
    res.json({ message: "Workout deleted" });
  } catch (err) {
    res.status(500).json({ message: "Could not delete workout" });
  }
});

// @route  GET /api/workouts/stats/summary  -> weekly aggregates for dashboard/charts
router.get("/stats/summary", async (req, res) => {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 6);
    since.setHours(0, 0, 0, 0);

    const workouts = await Workout.find({ user: req.userId, date: { $gte: since } }).sort({
      date: 1,
    });

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(since);
      d.setDate(since.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      days.push({ date: key, calories: 0, steps: 0, durationMin: 0, waterMl: 0, workouts: 0 });
    }

    workouts.forEach((w) => {
      const key = new Date(w.date).toISOString().slice(0, 10);
      const day = days.find((d) => d.date === key);
      if (day) {
        day.calories += w.caloriesBurned || 0;
        day.steps += w.steps || 0;
        day.durationMin += w.durationMin || 0;
        day.waterMl += w.waterMl || 0;
        day.workouts += 1;
      }
    });

    const totals = days.reduce(
      (acc, d) => ({
        calories: acc.calories + d.calories,
        steps: acc.steps + d.steps,
        durationMin: acc.durationMin + d.durationMin,
        waterMl: acc.waterMl + d.waterMl,
        workouts: acc.workouts + d.workouts,
      }),
      { calories: 0, steps: 0, durationMin: 0, waterMl: 0, workouts: 0 }
    );

    res.json({ days, totals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load stats" });
  }
});

module.exports = router;

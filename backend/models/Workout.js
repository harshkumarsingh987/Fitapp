const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      enum: ["running", "cycling", "walking", "strength", "yoga", "swimming", "cardio", "other"],
      required: true,
    },
    title: { type: String, required: true },
    durationMin: { type: Number, required: true, min: 1 },
    caloriesBurned: { type: Number, default: 0 },
    distanceKm: { type: Number, default: 0 },
    steps: { type: Number, default: 0 },
    waterMl: { type: Number, default: 0 },
    notes: { type: String, default: "" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

workoutSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model("Workout", workoutSchema);

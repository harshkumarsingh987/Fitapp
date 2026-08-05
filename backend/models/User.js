const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, minlength: 6 }, // not required -> allows Google-only accounts
    googleId: { type: String },
    avatar: { type: String, default: "" },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },

    // Fitness profile
    age: { type: Number },
    gender: { type: String, enum: ["male", "female", "other", ""], default: "" },
    heightCm: { type: Number },
    weightKg: { type: Number },
    goal: {
      type: String,
      enum: ["lose_weight", "build_muscle", "endurance", "general_fitness", ""],
      default: "",
    },
    dailyStepGoal: { type: Number, default: 8000 },
    dailyCalorieGoal: { type: Number, default: 2200 },
    dailyWaterGoalMl: { type: Number, default: 2500 },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

// BMI = weight(kg) / height(m)^2, rounded to 1 decimal
function computeBMI(heightCm, weightKg) {
  if (!heightCm || !weightKg) return null;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
}

function bmiCategory(bmi) {
  if (bmi === null) return null;
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obese";
}

userSchema.methods.toSafeObject = function () {
  const bmi = computeBMI(this.heightCm, this.weightKg);
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    avatar: this.avatar,
    authProvider: this.authProvider,
    age: this.age,
    gender: this.gender,
    heightCm: this.heightCm,
    weightKg: this.weightKg,
    goal: this.goal,
    dailyStepGoal: this.dailyStepGoal,
    dailyCalorieGoal: this.dailyCalorieGoal,
    dailyWaterGoalMl: this.dailyWaterGoalMl,
    bmi,
    bmiCategory: bmiCategory(bmi),
  };
};

module.exports = mongoose.model("User", userSchema);

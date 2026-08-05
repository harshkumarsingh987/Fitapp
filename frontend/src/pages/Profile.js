import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Grid,
  Button,
  Avatar,
  Alert,
} from "@mui/material";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import BMIGauge from "../components/BMIGauge";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    age: user?.age || "",
    gender: user?.gender || "",
    heightCm: user?.heightCm || "",
    weightKg: user?.weightKg || "",
    goal: user?.goal || "",
    dailyStepGoal: user?.dailyStepGoal || 8000,
    dailyCalorieGoal: user?.dailyCalorieGoal || 2200,
    dailyWaterGoalMl: user?.dailyWaterGoalMl || 2500,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const { data } = await api.put("/auth/profile", form);
      updateUser(data.user);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 720 }}>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        Profile & goals
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Keep this up to date so your AI coach gives better advice.
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <Avatar src={user?.avatar} sx={{ width: 72, height: 72, bgcolor: "#00C896", fontSize: 28 }}>
          {user?.name?.[0]?.toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h6">{user?.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
      </Box>

      {saved && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          Profile updated!
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            BODY MASS INDEX
          </Typography>
          <BMIGauge heightCm={form.heightCm} weightKg={form.weightKg} />
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
              PERSONAL DETAILS
            </Typography>
            <Grid container spacing={2.5} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <TextField name="name" label="Full name" value={form.name} onChange={handleChange} fullWidth />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField name="age" label="Age" type="number" value={form.age} onChange={handleChange} fullWidth />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField select name="gender" label="Gender" value={form.gender} onChange={handleChange} fullWidth>
                  <MenuItem value="">Prefer not to say</MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="heightCm"
                  label="Height (cm)"
                  type="number"
                  value={form.heightCm}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="weightKg"
                  label="Weight (kg)"
                  type="number"
                  value={form.weightKg}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField select name="goal" label="Primary goal" value={form.goal} onChange={handleChange} fullWidth>
                  <MenuItem value="">Not set</MenuItem>
                  <MenuItem value="lose_weight">Lose weight</MenuItem>
                  <MenuItem value="build_muscle">Build muscle</MenuItem>
                  <MenuItem value="endurance">Improve endurance</MenuItem>
                  <MenuItem value="general_fitness">General fitness</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
              DAILY GOALS
            </Typography>
            <Grid container spacing={2.5} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  name="dailyStepGoal"
                  label="Step goal"
                  type="number"
                  value={form.dailyStepGoal}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  name="dailyCalorieGoal"
                  label="Calorie goal (kcal)"
                  type="number"
                  value={form.dailyCalorieGoal}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  name="dailyWaterGoalMl"
                  label="Water goal (ml)"
                  type="number"
                  value={form.dailyWaterGoalMl}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>

            <Button type="submit" variant="contained" size="large" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

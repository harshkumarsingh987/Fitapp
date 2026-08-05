import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  CircularProgress,
} from "@mui/material";
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import DirectionsWalkRoundedIcon from "@mui/icons-material/DirectionsWalkRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
import TimerRoundedIcon from "@mui/icons-material/TimerRounded";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import BMIGauge from "../components/BMIGauge";

function StatCard({ icon, label, value, goal, unit, color }) {
  const pct = goal ? Math.min(100, Math.round((value / goal) * 100)) : 0;
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: `${color}1A`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color,
            }}
          >
            {icon}
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            {label}
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ mb: 0.5 }}>
          {value.toLocaleString()}
          <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
            {unit}
          </Typography>
        </Typography>
        {goal > 0 && (
          <>
            <LinearProgress
              variant="determinate"
              value={pct}
              sx={{
                height: 6,
                borderRadius: 3,
                mt: 1.5,
                bgcolor: `${color}1A`,
                "& .MuiLinearProgress-bar": { bgcolor: color, borderRadius: 3 },
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {pct}% of {goal.toLocaleString()} goal
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [tip, setTip] = useState("");
  const [tipLoading, setTipLoading] = useState(true);

  useEffect(() => {
    api.get("/workouts/stats/summary").then(({ data }) => setStats(data));
    api
      .post("/ai/coach", {})
      .then(({ data }) => setTip(data.reply))
      .catch(() => setTip("Keep moving — every workout counts!"))
      .finally(() => setTipLoading(false));
  }, []);

  if (!stats) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress sx={{ color: "#00C896" }} />
      </Box>
    );
  }

  const today = stats.days[stats.days.length - 1];
  const chartData = stats.days.map((d) => ({
    name: new Date(d.date).toLocaleDateString(undefined, { weekday: "short" }),
    calories: d.calories,
  }));

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        Today's overview
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        You've logged {stats.totals.workouts} workouts this week. Keep it up!
      </Typography>

      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<LocalFireDepartmentRoundedIcon />}
            label="Calories"
            value={today.calories}
            goal={user?.dailyCalorieGoal || 2200}
            unit="kcal"
            color="#FF6B4A"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<DirectionsWalkRoundedIcon />}
            label="Steps"
            value={today.steps}
            goal={user?.dailyStepGoal || 8000}
            unit="steps"
            color="#00C896"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<WaterDropRoundedIcon />}
            label="Water"
            value={today.waterMl}
            goal={user?.dailyWaterGoalMl || 2500}
            unit="ml"
            color="#4C6FFF"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<TimerRoundedIcon />}
            label="Active time"
            value={today.durationMin}
            goal={60}
            unit="min"
            color="#FFB020"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Calories burned — last 7 days
              </Typography>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00C896" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#00C896" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #E7E9F2" }}
                    formatter={(v) => [`${v} kcal`, "Calories"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="calories"
                    stroke="#00C896"
                    strokeWidth={2.5}
                    fill="url(#colorCal)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: "100%",
              background: "linear-gradient(160deg, #12141F 0%, #1B2A24 100%)",
              color: "#fff",
              border: "none",
            }}
          >
            <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <Chip
                label="AI Coach"
                size="small"
                sx={{ alignSelf: "flex-start", mb: 2, bgcolor: "rgba(0,200,150,0.2)", color: "#4FE0BC" }}
              />
              {tipLoading ? (
                <CircularProgress size={22} sx={{ color: "#4FE0BC" }} />
              ) : (
                <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                  {tip}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Body Mass Index
              </Typography>
              <BMIGauge heightCm={user?.heightCm} weightKg={user?.weightKg} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

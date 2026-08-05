import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Chip,
  IconButton,
  Stack,
  Divider,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import DirectionsRunRoundedIcon from "@mui/icons-material/DirectionsRunRounded";
import api from "../api/axios";

const TYPES = [
  { value: "running", label: "Running" },
  { value: "cycling", label: "Cycling" },
  { value: "walking", label: "Walking" },
  { value: "strength", label: "Strength" },
  { value: "yoga", label: "Yoga" },
  { value: "swimming", label: "Swimming" },
  { value: "cardio", label: "Cardio" },
  { value: "other", label: "Other" },
];

const TYPE_COLORS = {
  running: "#FF6B4A",
  cycling: "#4C6FFF",
  walking: "#00C896",
  strength: "#FFB020",
  yoga: "#9B6BFF",
  swimming: "#00B8D9",
  cardio: "#FF5470",
  other: "#6B7080",
};

const emptyForm = {
  type: "running",
  title: "",
  durationMin: "",
  caloriesBurned: "",
  distanceKm: "",
  steps: "",
  waterMl: "",
  notes: "",
};

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadWorkouts = () => {
    api.get("/workouts").then(({ data }) => setWorkouts(data.workouts));
  };

  useEffect(loadWorkouts, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/workouts", {
        ...form,
        durationMin: Number(form.durationMin),
        caloriesBurned: Number(form.caloriesBurned) || 0,
        distanceKm: Number(form.distanceKm) || 0,
        steps: Number(form.steps) || 0,
        waterMl: Number(form.waterMl) || 0,
      });
      setOpen(false);
      setForm(emptyForm);
      loadWorkouts();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/workouts/${id}`);
    loadWorkouts();
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 0.5 }}>
            Workouts
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {workouts.length} logged so far
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setOpen(true)}>
          Log workout
        </Button>
      </Box>

      {workouts.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 8 }}>
            <DirectionsRunRoundedIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              No workouts yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Log your first workout to start building your streak.
            </Typography>
            <Button variant="contained" onClick={() => setOpen(true)}>
              Log your first workout
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2.5}>
          {workouts.map((w) => (
            <Grid item xs={12} sm={6} md={4} key={w._id}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Chip
                      label={TYPES.find((t) => t.value === w.type)?.label || w.type}
                      size="small"
                      sx={{
                        bgcolor: `${TYPE_COLORS[w.type]}1A`,
                        color: TYPE_COLORS[w.type],
                        fontWeight: 700,
                        mb: 1.5,
                      }}
                    />
                    <IconButton size="small" onClick={() => handleDelete(w._id)}>
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography variant="h6" sx={{ mb: 0.5 }}>
                    {w.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(w.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {w.durationMin}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        min
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {w.caloriesBurned}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        kcal
                      </Typography>
                    </Box>
                    {w.distanceKm > 0 && (
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {w.distanceKm}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          km
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                  {w.notes && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                      {w.notes}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700 }}>
          Log a workout
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField select name="type" label="Type" value={form.type} onChange={handleChange} fullWidth>
              {TYPES.map((t) => (
                <MenuItem key={t.value} value={t.value}>
                  {t.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              name="title"
              label="Title"
              placeholder="e.g. Morning 5K"
              value={form.title}
              onChange={handleChange}
              required
              fullWidth
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  name="durationMin"
                  label="Duration (min)"
                  type="number"
                  value={form.durationMin}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="caloriesBurned"
                  label="Calories burned"
                  type="number"
                  value={form.caloriesBurned}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="distanceKm"
                  label="Distance (km)"
                  type="number"
                  value={form.distanceKm}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="steps"
                  label="Steps"
                  type="number"
                  value={form.steps}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="waterMl"
                  label="Water (ml)"
                  type="number"
                  value={form.waterMl}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
            <TextField
              name="notes"
              label="Notes (optional)"
              value={form.notes}
              onChange={handleChange}
              multiline
              rows={2}
              fullWidth
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? "Saving…" : "Save workout"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}

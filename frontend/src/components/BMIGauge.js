import { Box, Typography } from "@mui/material";
import { calculateBMI, bmiCategory, BMI_META, BMI_SCALE } from "../utils/bmi";

const { min, max, bands } = BMI_SCALE;
const toX = (value) => ((Math.min(Math.max(value, min), max) - min) / (max - min)) * 100;

const SEGMENTS = [
  { from: min, to: bands[0], color: BMI_META.underweight.color },
  { from: bands[0], to: bands[1], color: BMI_META.normal.color },
  { from: bands[1], to: bands[2], color: BMI_META.overweight.color },
  { from: bands[2], to: max, color: BMI_META.obese.color },
];

export default function BMIGauge({ heightCm, weightKg, compact = false }) {
  const bmi = calculateBMI(heightCm, weightKg);
  const category = bmiCategory(bmi);
  const meta = category ? BMI_META[category] : null;
  const markerX = bmi ? toX(bmi) : null;

  if (!bmi) {
    return (
      <Box>
        <Typography variant="body2" color="text.secondary">
          Add your height and weight in your profile to see your BMI.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: compact ? 1 : 2 }}>
        <Typography variant={compact ? "h5" : "h3"}>{bmi}</Typography>
        <Typography
          variant="body2"
          sx={{ fontWeight: 700, color: meta.color, bgcolor: `${meta.color}1A`, px: 1, py: 0.25, borderRadius: 1 }}
        >
          {meta.label}
        </Typography>
      </Box>

      <Box sx={{ position: "relative", height: compact ? 28 : 36 }}>
        {/* Segmented bar */}
        <Box sx={{ display: "flex", width: "100%", height: 10, borderRadius: 5, overflow: "hidden" }}>
          {SEGMENTS.map((s) => (
            <Box
              key={s.color}
              sx={{ width: `${toX(s.to) - toX(s.from)}%`, bgcolor: s.color, opacity: 0.85 }}
            />
          ))}
        </Box>

        {/* Marker */}
        <Box
          sx={{
            position: "absolute",
            top: -6,
            left: `${markerX}%`,
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent",
            borderTop: "8px solid #12141F",
          }}
        />
      </Box>

      {!compact && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            {min}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {max}
          </Typography>
        </Box>
      )}

      {!compact && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
          {meta.hint} BMI is a general screening measure and doesn't account for muscle mass or body
          composition — use it alongside other health markers.
        </Typography>
      )}
    </Box>
  );
}

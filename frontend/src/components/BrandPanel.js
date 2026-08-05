import { Box, Typography } from "@mui/material";

export default function BrandPanel() {
  return (
    <Box
      sx={{
        flex: 1,
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        justifyContent: "space-between",
        p: 6,
        background: "linear-gradient(160deg, #0E1420 0%, #14251F 55%, #0E1420 100%)",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, zIndex: 1 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "12px",
            background: "linear-gradient(135deg, #00C896 0%, #4C6FFF 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M2 12h4l2-7 4 14 3-9 2 4h5"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Pulse
        </Typography>
      </Box>

      <Box sx={{ zIndex: 1 }}>
        <Typography variant="h2" sx={{ fontSize: { md: 40, lg: 48 }, mb: 2, lineHeight: 1.1 }}>
          Every step,
          <br />
          every rep,
          <br />
          counted.
        </Typography>
        <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.65)", maxWidth: 380 }}>
          Log workouts, track your streaks, and get an AI coach that actually knows your numbers.
        </Typography>
      </Box>

      <Box sx={{ zIndex: 1, display: "flex", gap: 4 }}>
        {[
          ["12k+", "workouts logged"],
          ["98%", "goal completion"],
          ["4.9", "user rating"],
        ].map(([stat, label]) => (
          <Box key={label}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {stat}
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
              {label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Ambient pulse line decoration */}
      <Box
        component="svg"
        viewBox="0 0 600 200"
        sx={{ position: "absolute", bottom: -20, left: 0, width: "100%", opacity: 0.25, zIndex: 0 }}
      >
        <path
          d="M0 100 L120 100 L150 40 L190 160 L230 20 L270 100 L600 100"
          fill="none"
          stroke="#00C896"
          strokeWidth="2"
        />
      </Box>
    </Box>
  );
}

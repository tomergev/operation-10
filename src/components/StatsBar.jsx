import { Paper, Box, Typography } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import StarsIcon from "@mui/icons-material/Stars";
import TimerIcon from "@mui/icons-material/Timer";

export default function StatsBar({ score, streak, bestStreak, elapsedTime }) {
  const stats = [
    { label: "Score", value: score, icon: <EmojiEventsIcon fontSize="small" />, color: "primary.main" },
    { label: "Streak", value: streak, icon: <LocalFireDepartmentIcon fontSize="small" />, color: "primary.main" },
    { label: "Best", value: bestStreak, icon: <StarsIcon fontSize="small" />, color: "primary.main" },
    { label: "Time", value: elapsedTime, icon: <TimerIcon fontSize="small" />, color: "text.secondary" },
  ];

  return (
    <Paper
      elevation={1}
      sx={{
        display: "flex",
        justifyContent: "space-around",
        margin: "16px 0",
        padding: "12px 8px",
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      {stats.map((stat) => (
        <Box
          key={stat.label}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.5,
            minWidth: 56,
          }}
        >
          <Box sx={{ color: stat.color }}>{stat.icon}</Box>
          <Typography
            variant="caption"
            sx={{
              textTransform: "uppercase",
              letterSpacing: 0.5,
              color: "text.secondary",
              fontWeight: 600,
            }}
          >
            {stat.label}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: stat.label === "Time" ? "text.secondary" : "primary.main",
              fontSize: "1.25rem",
              fontFamily: stat.label === "Time" ? "'SF Mono', 'Fira Code', monospace" : "inherit",
              transition: "transform 0.2s ease",
              "&:active": { transform: "scale(1.15)" },
            }}
          >
            {stat.value}
          </Typography>
        </Box>
      ))}
    </Paper>
  );
}

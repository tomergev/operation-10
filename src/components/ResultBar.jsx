import { Paper, Box, Typography } from "@mui/material";

export default function ResultBar({ evaluation, isSolved }) {
  return (
    <Paper
      elevation={1}
      sx={{
        background: isSolved
          ? "linear-gradient(135deg, #00b894, #00cec9)"
          : "background.paper",
        borderRadius: 2,
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        border: "1px solid",
        borderColor: isSolved ? "success.main" : "divider",
        boxShadow: isSolved ? 4 : 1,
        transition: "all 0.2s ease",
      }}
    >
      <Typography
        variant="body1"
        sx={{
          fontWeight: 600,
          color: isSolved ? "rgba(255, 255, 255, 0.85)" : "text.secondary",
        }}
      >
        Result:
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontWeight: 700,
          color: isSolved ? "white" : "text.primary",
          fontFamily: "'SF Mono', 'Fira Code', monospace",
          fontSize: "1.25rem",
        }}
      >
        {isSolved ? "10 ✓" : evaluation.formatted}
      </Typography>
    </Paper>
  );
}

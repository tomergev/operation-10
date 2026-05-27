import { Box, Typography, IconButton, ButtonGroup, ToggleButton, ToggleButtonGroup } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

export default function Header({
  darkMode,
  setDarkMode,
  difficulty,
  onDifficultyChange,
  onOpenRules,
}) {
  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)",
        margin: "0 -16px",
        padding: { xs: "16px 16px 12px", sm: "20px 24px 16px" },
        borderRadius: 0,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        boxShadow: 6,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
        zIndex: 10,
        "&::after": {
          content: "''",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "rgba(255, 255, 255, 0.15)",
        },
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          color: "white",
          letterSpacing: -0.5,
          textShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        }}
      >
        Operation 10
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <ButtonGroup
          variant="contained"
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.15)",
            borderRadius: 20,
            px: 0.5,
            gap: 0,
            "& .MuiToggleButton-root": {
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: "0.7rem",
              fontWeight: 600,
              px: 1.5,
              py: 0.5,
              borderRadius: 18,
              textTransform: "uppercase",
              letterSpacing: 0.3,
              transition: "all 0.2s ease",
              "&:hover": {
                color: "white",
                bgcolor: "rgba(255, 255, 255, 0.1)",
              },
            },
            "& .MuiToggleButtonGroup-grouped": {
              border: "none !important",
              boxShadow: "none !important",
            },
          }}
        >
          {["easy", "medium", "hard"].map((mode) => (
            <ToggleButton
              key={mode}
              value={mode}
              selected={difficulty === mode}
              onClick={() => onDifficultyChange(mode)}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </ToggleButton>
          ))}
        </ButtonGroup>

        <IconButton
          onClick={onOpenRules}
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.15)",
            color: "white",
            width: 36,
            height: 36,
            borderRadius: "50%",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.25)",
              transform: "scale(1.05)",
            },
          }}
          title="Rules"
        >
          <InfoIcon fontSize="small" />
        </IconButton>

        <IconButton
          onClick={() => setDarkMode(!darkMode)}
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.15)",
            color: "white",
            width: 36,
            height: 36,
            borderRadius: "50%",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.25)",
              transform: "scale(1.05)",
            },
          }}
          title="Toggle dark mode"
        >
          {darkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
        </IconButton>
      </Box>
    </Box>
  );
}

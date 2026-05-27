import { Button, Box } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import CloseIcon from "@mui/icons-material/Close";

export default function ActionButtons({ onNewPuzzle, onHint, onReset, isSolved }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 1.5,
        flexWrap: "wrap",
        pb: 3,
      }}
    >
      <Button
        variant="contained"
        startIcon={<RefreshIcon />}
        onClick={onNewPuzzle}
        size="large"
        sx={{
          bgcolor: "primary.main",
          "&:hover": { bgcolor: "primary.dark" },
        }}
      >
        New Puzzle
      </Button>
      <Button
        variant="outlined"
        startIcon={<LightbulbIcon />}
        onClick={onHint}
        disabled={isSolved}
        size="large"
        sx={{
          borderColor: "warning.main",
          color: "warning.main",
          "&:hover": {
            borderColor: "warning.dark",
            bgcolor: "rgba(253, 203, 110, 0.1)",
          },
        }}
      >
        Hint
      </Button>
      <Button
        variant="outlined"
        startIcon={<CloseIcon />}
        onClick={onReset}
        size="large"
        sx={{
          borderColor: "error.main",
          color: "error.main",
          "&:hover": {
            borderColor: "error.dark",
            bgcolor: "rgba(255, 107, 107, 0.1)",
          },
        }}
      >
        Reset
      </Button>
    </Box>
  );
}

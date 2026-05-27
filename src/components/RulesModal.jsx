import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Paper,
  Chip,
  Grid,
  Button,
} from "@mui/material";

export default function RulesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 4, overflow: "hidden" },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          p: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          How to Play
        </Typography>
        <Box
          component="button"
          onClick={onClose}
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.15)",
            border: "none",
            color: "white",
            width: 32,
            height: 32,
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.1rem",
            fontWeight: 700,
            "&:hover": { bgcolor: "rgba(255, 255, 255, 0.25)" },
          }}
          title="Close rules"
        >
          ×
        </Box>
      </Box>

      <DialogContent sx={{ p: 3 }}>
        {/* Objective */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: "primary.main", mb: 1 }}>
            Objective
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "text.secondary", lineHeight: 1.7 }}
          >
            Place the four operators <strong>+</strong>, <strong>−</strong>,{" "}
            <strong>×</strong>, <strong>÷</strong> into the three empty slots
            between the four numbers so that the result equals{" "}
            <strong>10</strong>.
          </Typography>
        </Box>

        {/* How to Play */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: "primary.main", mb: 1 }}>
            How to Play
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 0 }}>
            {[
              "Drag an operator tile from the bottom row into any empty slot between two numbers.",
              "The equation evaluates in real time as you place operators.",
              "You can replace an already-placed operator by dragging a new one on top of it.",
              "When the result equals 10, you solve the puzzle!",
              "Operators can be reused — each slot is independent.",
            ].map((item, i) => (
              <Typography
                key={i}
                variant="body1"
                sx={{ color: "text.secondary", lineHeight: 1.8 }}
              >
                • {item}
              </Typography>
            ))}
          </Box>
        </Box>

        {/* Order of Operations */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: "primary.main", mb: 1 }}>
            Order of Operations
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "text.secondary", lineHeight: 1.7, mb: 1 }}
          >
            Multiplication and division are evaluated before addition and
            subtraction.
          </Typography>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              bgcolor: "action.hover",
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontFamily: "monospace",
                fontWeight: 700,
                fontSize: "1.1rem",
              }}
            >
              2 × 3 + 4 + 1 = 10
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", display: "block", mt: 0.5 }}
            >
              (× and ÷ first, then + and −)
            </Typography>
          </Paper>
        </Box>

        {/* Scoring */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: "primary.main", mb: 1 }}>
            Scoring
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 0 }}>
            {[
              "Score — total puzzles solved.",
              "Streak — consecutive puzzles solved. Resets when you start a new puzzle.",
              "Best — your longest streak ever (saved locally).",
            ].map((item, i) => (
              <Typography
                key={i}
                variant="body1"
                sx={{ color: "text.secondary", lineHeight: 1.8 }}
              >
                • {item}
              </Typography>
            ))}
          </Box>
        </Box>

        {/* Difficulty Modes */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: "primary.main", mb: 2 }}>
            Difficulty Modes
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Paper
                elevation={1}
                sx={{ p: 2, textAlign: "center", borderRadius: 3 }}
              >
                <Chip label="Easy" color="success" size="small" sx={{ mb: 1 }} />
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", lineHeight: 1.6 }}
                >
                  Numbers range from <strong>1 to 9</strong> (no zeros). Straightforward solutions.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper
                elevation={1}
                sx={{ p: 2, textAlign: "center", borderRadius: 3 }}
              >
                <Chip label="Medium" color="warning" size="small" sx={{ mb: 1 }} />
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", lineHeight: 1.6 }}
                >
                  Numbers range from <strong>0 to 9</strong>. Zero adds complexity with division and subtraction.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper
                elevation={1}
                sx={{ p: 2, textAlign: "center", borderRadius: 3 }}
              >
                <Chip label="Hard" color="error" size="small" sx={{ mb: 1 }} />
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", lineHeight: 1.6 }}
                >
                  More challenging combinations. May require intermediate decimals or negative values.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Tips */}
        <Box>
          <Typography variant="h6" sx={{ color: "primary.main", mb: 1 }}>
            Tips
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 0 }}>
            {[
              "Use the Hint button to highlight one valid operator placement (lasts 4 seconds).",
              "Not every puzzle has a unique solution — try different combinations!",
              "Work backwards: think about what the last operation could be to reach 10.",
            ].map((item, i) => (
              <Typography
                key={i}
                variant="body1"
                sx={{ color: "text.secondary", lineHeight: 1.8 }}
              >
                • {item}
              </Typography>
            ))}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: "primary.main",
            "&:hover": { bgcolor: "primary.dark" },
          }}
        >
          Got it!
        </Button>
      </DialogActions>
    </Dialog>
  );
}

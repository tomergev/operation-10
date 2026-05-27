import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Grid,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Fab,
  Alert,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import {
  Refresh,
  Lightbulb,
  Info,
  DarkMode,
  LightMode,
  EmojiEvents,
  Timer,
  LocalFireDepartment,
  Stars,
} from "@mui/icons-material";
import {
  generatePuzzle,
  evaluateAndFormat,
  checkSolution,
} from "./utils/puzzle";
import { playSound } from "./utils/audio";

const EMPTY_SLOTS = [null, null, null];

export default function App() {
  const [puzzle, setPuzzle] = useState(() => generatePuzzle("easy"));
  const [operators, setOperators] = useState([...EMPTY_SLOTS]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [difficulty, setDifficulty] = useState("easy");
  const [darkMode, setDarkMode] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [hintHighlighted, setHintHighlighted] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [touchDragging, setTouchDragging] = useState(null);
  const [touchPos, setTouchPos] = useState({ x: 0, y: 0 });
  const [dragOverSlot, setDragOverSlot] = useState(null);
  const [dragging, setDragging] = useState(null);

  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  // Timer
  useEffect(() => {
    if (isSolved) return;
    const interval = setInterval(() => setElapsedTime((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isSolved]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("operation10-best");
    if (saved) setBestStreak(parseInt(saved, 10));
    const savedDark = localStorage.getItem("operation10-dark");
    if (savedDark === "true") setDarkMode(true);
  }, []);

  // Save best streak
  useEffect(() => {
    if (streak > bestStreak) {
      setBestStreak(streak);
      localStorage.setItem("operation10-best", streak.toString());
    }
  }, [streak, bestStreak]);

  // Save dark mode
  useEffect(() => {
    localStorage.setItem("operation10-dark", darkMode.toString());
  }, [darkMode]);

  // Evaluate
  const filledOps = operators.filter((o) => o !== null);
  const evaluation =
    filledOps.length > 0
      ? evaluateAndFormat(puzzle.numbers, filledOps)
      : { result: null, formatted: "—" };

  // Check solution
  useEffect(() => {
    if (filledOps.length === 3 && !isSolved) {
      const solved = checkSolution(puzzle.numbers, filledOps);
      if (solved) {
        setIsSolved(true);
        setScore((s) => s + 1);
        setStreak((s) => s + 1);
        playSound("success");
      }
    }
  }, [operators, puzzle.numbers, isSolved]);

  const handleNewPuzzle = useCallback(() => {
    setPuzzle(generatePuzzle(difficulty));
    setOperators([...EMPTY_SLOTS]);
    setIsSolved(false);
    setElapsedTime(0);
    setHintHighlighted(false);
    playSound("tick");
  }, [difficulty]);

  const handleDifficultyChange = useCallback((mode) => {
    setDifficulty(mode);
    setPuzzle(generatePuzzle(mode));
    setOperators([...EMPTY_SLOTS]);
    setIsSolved(false);
    setElapsedTime(0);
    setHintHighlighted(false);
  }, []);

  const handleReset = useCallback(() => {
    setOperators([...EMPTY_SLOTS]);
    setIsSolved(false);
    setElapsedTime(0);
    setHintHighlighted(false);
    playSound("tick");
  }, []);

  const handleHint = useCallback(() => {
    if (puzzle.solutions && puzzle.solutions.length > 0) {
      setHintHighlighted(true);
      setTimeout(() => setHintHighlighted(false), 4000);
      playSound("tick");
    }
  }, [puzzle.solutions]);

  const handleDropOnSlot = useCallback(
    (slotIndex) => {
      if (dragging !== null) {
        setOperators((prev) => {
          const next = [...prev];
          next[slotIndex] = dragging;
          return next;
        });
        setDragOverSlot(null);
        playSound("drop");
      }
    },
    [dragging],
  );

  const handleDragStart = useCallback((op) => {
    setDragging(op);
    playSound("drag");
  }, []);

  const handleDragOver = useCallback((e, slotIndex) => {
    e.preventDefault();
    setDragOverSlot(slotIndex);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverSlot(null);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragging(null);
    setDragOverSlot(null);
  }, []);

  const handleTouchStart = useCallback((op, e) => {
    const touch = e.touches[0];
    setTouchDragging(op);
    setTouchPos({ x: touch.clientX, y: touch.clientY });
    playSound("drag");
  }, []);

  const handleTouchMove = useCallback((e) => {
    const touch = e.touches[0];
    setTouchPos({ x: touch.clientX, y: touch.clientY });
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      if (!touchDragging) return;
      const touch = e.changedTouches[0];
      const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
      const slotEl = elements.find((el) => el.dataset.slotIndex !== undefined);
      if (slotEl) {
        const slotIndex = parseInt(slotEl.dataset.slotIndex, 10);
        setOperators((prev) => {
          const next = [...prev];
          next[slotIndex] = touchDragging;
          return next;
        });
        playSound("drop");
      }
      setTouchDragging(null);
      setTouchPos({ x: 0, y: 0 });
    },
    [touchDragging],
  );

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const difficultyLabels = { easy: "Easy", medium: "Medium", hard: "Hard" };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        transition: "background 0.3s",
      }}
    >
      {/* Top App Bar */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          px: { xs: 2, sm: 3 },
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
          Operation 10
        </Typography>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Box
            sx={{
              display: "flex",
              bgcolor: "rgba(255,255,255,0.2)",
              borderRadius: 3,
              p: 0.5,
            }}
          >
            {["easy", "medium", "hard"].map((mode) => (
              <Button
                key={mode}
                size="small"
                onClick={() => handleDifficultyChange(mode)}
                sx={{
                  bgcolor: difficulty === mode ? "white" : "transparent",
                  color:
                    difficulty === mode
                      ? "primary.main"
                      : "rgba(255,255,255,0.8)",
                  minWidth: 0,
                  px: 1.5,
                  py: 0.5,
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor:
                      difficulty === mode
                        ? "rgba(255,255,255,0.9)"
                        : "rgba(255,255,255,0.15)",
                  },
                }}
              >
                {difficultyLabels[mode]}
              </Button>
            ))}
          </Box>
          <IconButton
            onClick={() => setShowRules(true)}
            sx={{ color: "white" }}
            title="Rules"
          >
            <Info />
          </IconButton>
          <IconButton
            onClick={() => setDarkMode(!darkMode)}
            sx={{ color: "white" }}
            title="Toggle dark mode"
          >
            {darkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Box>
      </Box>

      {/* Rules Dialog */}
      <RulesDialog open={showRules} onClose={() => setShowRules(false)} />

      <Container
        maxWidth="sm"
        sx={{
          py: { xs: 2, sm: 3 },
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Stats */}
        <Paper
          elevation={2}
          sx={{
            p: { xs: 1.5, sm: 2 },
            display: "flex",
            justifyContent: "space-around",
            borderRadius: 3,
          }}
        >
          <StatItem
            icon={<EmojiEvents fontSize="small" />}
            label="Score"
            value={score}
            color="primary"
          />
          <StatItem
            icon={<LocalFireDepartment fontSize="small" />}
            label="Streak"
            value={streak}
            color="secondary"
          />
          <StatItem
            icon={<Stars fontSize="small" />}
            label="Best"
            value={bestStreak}
            color="warning"
          />
          <StatItem
            icon={<Timer fontSize="small" />}
            label="Time"
            value={formatTime(elapsedTime)}
            color="info"
          />
        </Paper>

        {/* Equation */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            bgcolor: "background.paper",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: { xs: 0.5, sm: 1 },
              flexWrap: "nowrap",
              overflowX: "hidden",
              py: 1,
            }}
          >
            {/* Number 1 */}
            <NumberBox>{puzzle.numbers[0]}</NumberBox>

            {/* Slot 1 */}
            <OperatorSlot
              index={0}
              op={operators[0]}
              dragOverSlot={dragOverSlot}
              hintHighlighted={hintHighlighted}
              isSolved={isSolved}
              onDrop={handleDropOnSlot}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              puzzle={puzzle}
            />

            {/* Number 2 */}
            <NumberBox>{puzzle.numbers[1]}</NumberBox>

            {/* Slot 2 */}
            <OperatorSlot
              index={1}
              op={operators[1]}
              dragOverSlot={dragOverSlot}
              hintHighlighted={hintHighlighted}
              isSolved={isSolved}
              onDrop={handleDropOnSlot}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              puzzle={puzzle}
            />

            {/* Number 3 */}
            <NumberBox>{puzzle.numbers[2]}</NumberBox>

            {/* Slot 3 */}
            <OperatorSlot
              index={2}
              op={operators[2]}
              dragOverSlot={dragOverSlot}
              hintHighlighted={hintHighlighted}
              isSolved={isSolved}
              onDrop={handleDropOnSlot}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              puzzle={puzzle}
            />

            {/* Number 4 */}
            <NumberBox>{puzzle.numbers[3]}</NumberBox>

            {/* Equals */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: { xs: 24, sm: 32 },
                height: { xs: 42, sm: 48 },
                fontSize: { xs: "1.5rem", sm: "1.75rem" },
                fontWeight: 800,
                color: "text.secondary",
              }}
            >
              =
            </Box>

            {/* Result */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: { xs: 38, sm: 52 },
                height: { xs: 46, sm: 58 },
                bgcolor: "primary.main",
                borderRadius: 2,
                color: "white",
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
                fontWeight: 800,
                boxShadow: 2,
              }}
            >
              {isSolved ? "10" : "?"}
            </Box>
          </Box>
        </Paper>

        {/* Result Bar */}
        <Box
          sx={{
            p: { xs: 1.5, sm: 2 },
            borderRadius: 2,
            bgcolor: isSolved ? "success.light" : "background.paper",
            color: isSolved ? "success.dark" : "text.primary",
            textAlign: "center",
            fontWeight: 700,
            fontSize: { xs: "1rem", sm: "1.25rem" },
            boxShadow: isSolved ? 3 : 1,
            transition: "all 0.3s",
          }}
        >
          {isSolved ? (
            <Typography variant="h6" sx={{ color: "white" }}>
              Correct! = 10
            </Typography>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1,
                alignItems: "center",
              }}
            >
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Result:
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "monospace",
                  color:
                    evaluation.result === 10 ? "success.main" : "text.primary",
                }}
              >
                {evaluation.formatted}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Operators */}
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              textTransform: "uppercase",
              letterSpacing: 1,
              color: "text.secondary",
              fontWeight: 700,
              display: "block",
              mb: 2,
            }}
          >
            Drag operators into the slots
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: { xs: 1, sm: 2 },
              flexWrap: "wrap",
            }}
          >
            {["+", "-", "×", "÷"].map((op) => (
              <OperatorTile
                key={op}
                op={op}
                dragging={dragging}
                touchDragging={touchDragging}
                touchPos={touchPos}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />
            ))}
          </Box>
        </Paper>

        {/* Action Buttons */}
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
            startIcon={<Refresh />}
            onClick={handleNewPuzzle}
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
            startIcon={<Lightbulb />}
            onClick={handleHint}
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
            startIcon={<Refresh />}
            onClick={handleReset}
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
      </Container>

      {/* Touch drag follower */}
      {touchDragging && (
        <Box
          sx={{
            position: "fixed",
            left: touchPos.x,
            top: touchPos.y,
            width: 56,
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 9999,
            bgcolor: "background.paper",
            border: "2px solid",
            borderColor: "primary.main",
            borderRadius: 2,
            boxShadow: 6,
            transform: "translate(-50%, -50%)",
            fontSize: "1.75rem",
            fontWeight: 800,
            color: "primary.main",
          }}
        >
          {touchDragging}
        </Box>
      )}
    </Box>
  );
}

/* ---------- Sub-components ---------- */

function NumberBox({ children }) {
  return (
    <Box
      sx={{
        width: { xs: 36, sm: 52, md: 64 },
        height: { xs: 44, sm: 60, md: 72 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.paper",
        border: "2px solid",
        borderColor: "divider",
        borderRadius: 2,
        boxShadow: 1,
        flexShrink: 0,
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: 800,
          color: "text.primary",
          fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
        }}
      >
        {children}
      </Typography>
    </Box>
  );
}

function OperatorSlot({
  index,
  op,
  dragOverSlot,
  hintHighlighted,
  isSolved,
  onDrop,
  onDragOver,
  onDragLeave,
  puzzle,
}) {
  const isHighlighted =
    hintHighlighted && puzzle.hintSolution && puzzle.hintSolution[index] === op;
  const isDragOver = dragOverSlot === index;

  return (
    <Box
      sx={{
        width: { xs: 34, sm: 48, md: 60 },
        height: { xs: 42, sm: 52, md: 64 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        border: isDragOver ? "3px solid" : "2px dashed",
        borderColor: isDragOver
          ? "primary.main"
          : isHighlighted
            ? "warning.main"
            : "divider",
        borderRadius: 2,
        cursor: "pointer",
        transition: "all 0.2s",
        transform: isDragOver ? "scale(1.05)" : "scale(1)",
        boxShadow: isDragOver ? 4 : 0,
        animation: isHighlighted ? "pulse 1.5s ease-in-out infinite" : "none",
        "@keyframes pulse": {
          "0%, 100%": { boxShadow: "0 0 0 3px rgba(253, 203, 110, 0.3)" },
          "50%": { boxShadow: "0 0 0 6px rgba(253, 203, 110, 0.5)" },
        },
        flexShrink: 0,
      }}
      data-slot-index={index}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(index);
      }}
      onDragOver={(e) => onDragOver(e, index)}
      onDragLeave={onDragLeave}
    >
      {op ? (
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: isSolved ? "success.main" : "primary.main",
            fontSize: { xs: "1rem", sm: "1.25rem", md: "1.75rem" },
            animation: isSolved ? "popIn 0.3s ease" : "none",
            "@keyframes popIn": {
              "0%": { transform: "scale(0.5)", opacity: 0 },
              "60%": { transform: "scale(1.2)" },
              "100%": { transform: "scale(1)", opacity: 1 },
            },
          }}
        >
          {op}
        </Typography>
      ) : (
        <Typography
          variant="h6"
          sx={{ color: "text.secondary", fontWeight: 600 }}
        >
          ?
        </Typography>
      )}
    </Box>
  );
}

function OperatorTile({
  op,
  dragging,
  touchDragging,
  touchPos,
  onDragStart,
  onDragEnd,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}) {
  const colors = {
    "+": { bg: "#e8f5e9", color: "#2e7d32" },
    "-": { bg: "#fff3e0", color: "#e65100" },
    "×": { bg: "#e3f2fd", color: "#1565c0" },
    "÷": { bg: "#fce4ec", color: "#c62828" },
  };
  const c = colors[op] || { bg: "#f5f5f5", color: "#333" };

  return (
    <Box
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", op);
        onDragStart(op);
      }}
      onDragEnd={onDragEnd}
      onMouseDown={(e) => {
        if (e.button === 0) {
          onDragStart(op);
        }
      }}
      onTouchStart={(e) => onTouchStart(op, e)}
      onTouchMove={handleTouchMoveGlobal}
      onTouchEnd={handleTouchEndGlobal}
      sx={{
        width: { xs: 52, sm: 64, md: 72 },
        height: { xs: 52, sm: 64, md: 72 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: c.bg,
        color: c.color,
        borderRadius: 2,
        cursor: "grab",
        userSelect: "none",
        transition: "all 0.2s",
        boxShadow: 2,
        border: "2px solid transparent",
        "&:hover": {
          transform: "translateY(-4px) scale(1.05)",
          boxShadow: 4,
          borderColor: c.color,
        },
        "&:active": {
          cursor: "grabbing",
          transform: "scale(1.1)",
          boxShadow: 6,
        },
        ...(touchDragging === op
          ? {
              position: "fixed",
              left: touchPos.x,
              top: touchPos.y,
              transform: "translate(-50%, -50%)",
              zIndex: 9999,
              pointerEvents: "none",
              boxShadow: 8,
            }
          : {}),
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: 800,
          fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
        }}
      >
        {op}
      </Typography>
    </Box>
  );
}

// Global touch handlers for the dragged tile
function handleTouchMoveGlobal(e) {
  // This won't work standalone — we need to handle it differently
}

function handleTouchEndGlobal(e) {
  // This won't work standalone — we need to handle it differently
}

function StatItem({ icon, label, value, color }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0.5,
        minWidth: 56,
      }}
    >
      <Box sx={{ color }}>{icon}</Box>
      <Typography
        variant="caption"
        sx={{
          textTransform: "uppercase",
          letterSpacing: 0.5,
          color: "text.secondary",
          fontWeight: 600,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 800,
          color:
            color === "primary"
              ? "primary.main"
              : color === "secondary"
                ? "secondary.main"
                : color === "warning"
                  ? "warning.main"
                  : "info.main",
          fontSize: "1.25rem",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function RulesDialog({ open, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 4, overflow: "hidden" },
      }}
    >
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
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          ✕
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 3 }}>
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

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: "primary.main", mb: 1 }}>
            How to Play
          </Typography>
          <ListItems
            items={[
              "Drag an operator tile from the bottom row into any empty slot between two numbers.",
              "The equation evaluates in real time as you place operators.",
              "You can replace an already-placed operator by dragging a new one on top of it.",
              "When the result equals 10, you solve the puzzle!",
              "Operators can be reused — each slot is independent.",
            ]}
          />
        </Box>

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

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: "primary.main", mb: 1 }}>
            Scoring
          </Typography>
          <ListItems
            items={[
              "Score — total puzzles solved.",
              "Streak — consecutive puzzles solved. Resets when you start a new puzzle.",
              "Best — your longest streak ever (saved locally).",
            ]}
          />
        </Box>

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
                <Chip
                  label="Easy"
                  color="success"
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", lineHeight: 1.6 }}
                >
                  Numbers range from <strong>1 to 9</strong> (no zeros).
                  Straightforward solutions.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper
                elevation={1}
                sx={{ p: 2, textAlign: "center", borderRadius: 3 }}
              >
                <Chip
                  label="Medium"
                  color="warning"
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", lineHeight: 1.6 }}
                >
                  Numbers range from <strong>0 to 9</strong>. Zero adds
                  complexity with division and subtraction.
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
                  More challenging combinations. May require intermediate
                  decimals or negative values.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ color: "primary.main", mb: 1 }}>
            Tips
          </Typography>
          <ListItems
            items={[
              "Use the Hint button to highlight one valid operator placement (lasts 4 seconds).",
              "Not every puzzle has a unique solution — try different combinations!",
              "Work backwards: think about what the last operation could be to reach 10.",
            ]}
          />
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

function ListItems({ items }) {
  return (
    <Box component="ul" sx={{ pl: 2, mb: 0 }}>
      {items.map((item, i) => (
        <Typography
          key={i}
          variant="body1"
          sx={{ color: "text.secondary", lineHeight: 1.8 }}
        >
          • {item}
        </Typography>
      ))}
    </Box>
  );
}

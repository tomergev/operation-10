import { operatorSymbol } from "../utils/puzzle";
import { Paper, Box, Typography } from "@mui/material";

const OPERATOR_CONFIG = [
  { code: "+", label: "+", color: "#2e7d32", bg: "#e8f5e9" },
  { code: "-", label: "−", color: "#e65100", bg: "#fff3e0" },
  { code: "*", label: "×", color: "#1565c0", bg: "#e3f2fd" },
  { code: "/", label: "÷", color: "#c62828", bg: "#fce4ec" },
];

export default function OperatorsPool({
  dragging,
  onDragStart,
  onDragEnd,
  touchDragging,
  touchPos,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 4,
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
        {OPERATOR_CONFIG.map((op) => (
          <OperatorTile
            key={op.code}
            op={op.code}
            label={op.label}
            color={op.color}
            bg={op.bg}
            dragging={dragging}
            touchDragging={touchDragging}
            touchPos={touchPos}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          />
        ))}
      </Box>

      {/* Floating touch-dragged operator */}
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
          {operatorSymbol(touchDragging)}
        </Box>
      )}
    </Paper>
  );
}

function OperatorTile({
  op,
  label,
  color,
  bg,
  dragging,
  touchDragging,
  touchPos,
  onDragStart,
  onDragEnd,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}) {
  return (
    <Box
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", op);
        e.dataTransfer.effectAllowed = "move";
        onDragStart(op);
      }}
      onDragEnd={onDragEnd}
      onTouchStart={(e) => onTouchStart(op, e)}
      sx={{
        width: { xs: 52, sm: 64, md: 72 },
        height: { xs: 52, sm: 64, md: 72 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: bg,
        color: color,
        borderRadius: 2,
        cursor: "grab",
        userSelect: "none",
        transition: "all 0.2s",
        boxShadow: 2,
        border: "2px solid transparent",
        opacity: dragging === op ? 0.4 : 1,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: "''",
          position: "absolute",
          inset: 0,
          bgcolor: bg,
          borderRadius: "inherit",
          zIndex: 0,
        },
        "&:hover": {
          transform: "translateY(-4px) scale(1.05)",
          boxShadow: 4,
          borderColor: color,
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
          position: "relative",
          zIndex: 1,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

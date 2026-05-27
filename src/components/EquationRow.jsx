import { operatorSymbol } from "../utils/puzzle";
import { Box, Typography } from "@mui/material";

export default function EquationRow({
  numbers,
  operators,
  dragOverSlot,
  hintHighlighted,
  isSolved,
  onDropOnSlot,
  onDragOver,
  onDragLeave,
  puzzle,
}) {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: 4,
        padding: { xs: "16px 12px", sm: "20px 16px" },
        boxShadow: 1,
        border: "1px solid",
        borderColor: "divider",
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
          width: "100%",
        }}
      >
        {/* Number 1 */}
        <NumberBox>{numbers[0]}</NumberBox>

        {/* Slot 1 */}
        <SlotBox
          index={0}
          op={operators[0]}
          dragOverSlot={dragOverSlot}
          hintHighlighted={hintHighlighted}
          isSolved={isSolved}
          onDropOnSlot={onDropOnSlot}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          puzzle={puzzle}
        />

        {/* Number 2 */}
        <NumberBox>{numbers[1]}</NumberBox>

        {/* Slot 2 */}
        <SlotBox
          index={1}
          op={operators[1]}
          dragOverSlot={dragOverSlot}
          hintHighlighted={hintHighlighted}
          isSolved={isSolved}
          onDropOnSlot={onDropOnSlot}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          puzzle={puzzle}
        />

        {/* Number 3 */}
        <NumberBox>{numbers[2]}</NumberBox>

        {/* Slot 3 */}
        <SlotBox
          index={2}
          op={operators[2]}
          dragOverSlot={dragOverSlot}
          hintHighlighted={hintHighlighted}
          isSolved={isSolved}
          onDropOnSlot={onDropOnSlot}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          puzzle={puzzle}
        />

        {/* Number 4 */}
        <NumberBox>{numbers[3]}</NumberBox>

        {/* Equals */}
        <Box
          sx={{
            width: { xs: 28, sm: 36 },
            height: { xs: 46, sm: 56 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "text.secondary",
            }}
          >
            =
          </Typography>
        </Box>

        {/* Result */}
        <Box
          sx={{
            width: { xs: 36, sm: 52, md: 64 },
            height: { xs: 44, sm: 60, md: 72 },
            background: "linear-gradient(145deg, #6c5ce7, #a29bfe)",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(108, 92, 231, 0.3)",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: "white",
              fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
            }}
          >
            {isSolved ? "10" : "?"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

function NumberBox({ children }) {
  return (
    <Box
      sx={{
        width: { xs: 36, sm: 52, md: 64 },
        height: { xs: 44, sm: 60, md: 72 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(145deg, background.paper, background.default)",
        border: "2px solid",
        borderColor: "divider",
        borderRadius: 2,
        boxShadow: 1,
        transition: "all 0.2s ease",
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

function SlotBox({
  index,
  op,
  dragOverSlot,
  hintHighlighted,
  isSolved,
  onDropOnSlot,
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
        boxShadow: isDragOver ? 4 : isHighlighted ? 0 : 0,
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
        onDropOnSlot(index);
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
          {operatorSymbol(op)}
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

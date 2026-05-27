// Puzzle generation logic
// Generates puzzles that ALWAYS have at least one valid solution equal to 10

const OPERATORS = ['+', '-', '*', '/'];
const OPERATOR_SYMBOLS = { '+': '+', '-': '−', '*': '×', '/': '÷' };

// Evaluate expression respecting order of operations
export function evaluateExpression(numbers, ops) {
  // Build array of numbers and operators
  const values = [...numbers];
  const opList = [...ops];

  // First pass: multiplication and division
  let i = 0;
  while (i < opList.length) {
    if (opList[i] === '*' || opList[i] === '/') {
      const a = values[i];
      const b = values[i + 1];
      if (opList[i] === '/') {
        if (b === 0) return null; // divide by zero
        values[i] = a / b;
      } else {
        values[i] = a * b;
      }
      values.splice(i + 1, 1);
      opList.splice(i, 1);
    } else {
      i++;
    }
  }

  // Second pass: addition and subtraction
  let result = values[0];
  for (let j = 0; j < opList.length; j++) {
    if (opList[j] === '+') result += values[j + 1];
    else if (opList[j] === '-') result -= values[j + 1];
  }

  return result;
}

// Check if an operator placement results in 10
export function checkSolution(numbers, ops) {
  const result = evaluateExpression(numbers, ops);
  if (result === null) return false;
  return Math.abs(result - 10) < 0.001;
}

// Find all valid solutions for a given set of numbers
export function findAllSolutions(numbers) {
  const solutions = [];

  // Try all combinations of operators
  const total = Math.pow(4, 3); // 3 slots, 4 operators each
  for (let i = 0; i < total; i++) {
    const ops = [];
    let temp = i;
    for (let j = 0; j < 3; j++) {
      ops.push(OPERATORS[temp % 4]);
      temp = Math.floor(temp / 4);
    }

    if (checkSolution(numbers, ops)) {
      solutions.push(ops);
    }
  }

  return solutions;
}

// Generate a puzzle that always has a solution
export function generatePuzzle(difficulty = 'easy') {
  let numbers;
  let maxAttempts = 1000;

  while (maxAttempts-- > 0) {
    // Generate 4 random numbers based on difficulty
    switch (difficulty) {
      case 'easy':
        // Numbers 1-9, avoid zeros
        numbers = Array.from({ length: 4 }, () => Math.floor(Math.random() * 9) + 1);
        break;
      case 'medium':
        // Numbers 0-9
        numbers = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));
        break;
      case 'hard':
        // Numbers 0-9, more challenging combinations
        numbers = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));
        break;
      default:
        numbers = Array.from({ length: 4 }, () => Math.floor(Math.random() * 9) + 1);
    }

    const solutions = findAllSolutions(numbers);
    if (solutions.length > 0) {
      return {
        numbers,
        solutions,
        // Pick a random solution as the "intended" one
        hintSolution: solutions[Math.floor(Math.random() * solutions.length)],
      };
    }
  }

  // Fallback: generate a puzzle from a known solution
  const baseNumbers = [2, 3, 4, 1];
  const baseOps = ['*', '+', '+']; // 2*3+4+1 = 11... not 10
  // Let's try: 2*3+4+1 = 11, nope. 2+3+4+1 = 10 ✓
  return {
    numbers: baseNumbers,
    solutions: [['+', '+', '+']],
    hintSolution: ['+', '+', '+'],
  };
}

// Format a number for display (max 2 decimal places)
export function formatNumber(num) {
  if (num === null || num === undefined) return '—';
  if (Number.isInteger(num)) return num.toString();
  return parseFloat(num.toFixed(2)).toString();
}

// Convert operator code to display symbol
export function operatorSymbol(op) {
  return OPERATOR_SYMBOLS[op] || op;
}

// Evaluate and format the result
export function evaluateAndFormat(numbers, ops) {
  const result = evaluateExpression(numbers, ops);
  if (result === null) return { result: null, formatted: 'Error' };
  return { result, formatted: formatNumber(result) };
}

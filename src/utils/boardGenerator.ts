export const generateSudokuBoard = (
  difficulty: string
): { board: number[][]; solution: number[][] } => {
  const baseBoard = Array.from({ length: 9 }, () => Array(9).fill(0));

  const generateSolution = (board: number[][]): boolean => {
    const isValid = (row: number, col: number, num: number) => {
      for (let x = 0; x < 9; x++) {
        if (board[row][x] === num) return false;
      }

      for (let x = 0; x < 9; x++) {
        if (board[x][col] === num) return false;
      }

      const startRow = Math.floor(row / 3) * 3;
      const startCol = Math.floor(col / 3) * 3;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[startRow + i][startCol + j] === num) return false;
        }
      }

      return true;
    };

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          const nums = Array.from({ length: 9 }, (_, i) => i + 1).sort(
            () => Math.random() - 0.5
          );

          for (const num of nums) {
            if (isValid(row, col, num)) {
              board[row][col] = num;
              if (generateSolution(board)) return true;
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  const removeCells = (board: number[][], emptyCells: number) => {
    const removed = new Set<string>();
    while (removed.size < emptyCells) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (board[row][col] !== 0) {
        removed.add(`${row},${col}`);
        board[row][col] = 0;
      }
    }
  };

  let emptyCells;
  if (difficulty === "Kolay") emptyCells = 20;
  else if (difficulty === "Orta") emptyCells = 40;
  else emptyCells = 60;

  const board = JSON.parse(JSON.stringify(baseBoard));
  generateSolution(board);
  const solution = JSON.parse(JSON.stringify(board));
  removeCells(board, emptyCells);

  return { board, solution };
};

export const isMoveValid = (
  board: number[][],
  row: number,
  col: number,
  num: number
): boolean => {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) return false;
  }

  for (let i = 0; i < 9; i++) {
    if (board[i][col] === num) return false;
  }

  const boxStartRow = Math.floor(row / 3) * 3;
  const boxStartCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[boxStartRow + i][boxStartCol + j] === num) return false;
    }
  }

  return true;
};

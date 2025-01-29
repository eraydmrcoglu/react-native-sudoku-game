import React, { createContext, useContext, useState } from "react";

type GameContextType = {
  board: number[][];
  setBoard: (board: number[][]) => void;
};

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [board, setBoard] = useState<number[][]>([]);

  return (
    <GameContext.Provider value={{ board, setBoard }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
};

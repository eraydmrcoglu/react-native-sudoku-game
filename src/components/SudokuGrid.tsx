import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

const SudokuGrid = ({
  board,
  selectedCell,
  onCellPress,
  errorCells = [],
  theme = "light",
}: {
  board: number[][];
  selectedCell: [number, number] | null;
  onCellPress: (row: number, col: number) => void;
  errorCells?: [number, number][];
  theme?: "light" | "dark";
}) => {
  return (
    <View
      style={{
        padding: 8,
        backgroundColor: theme === "dark" ? "#1E1E1E" : "#CBC4BC",
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={{ flexDirection: "row" }}>
          {row.map((cell, colIndex) => {
            const isSelected =
              selectedCell &&
              selectedCell[0] === rowIndex &&
              selectedCell[1] === colIndex;

            const isThickRightBorder =
              (colIndex + 1) % 3 === 0 && colIndex !== 8;
            const isThickBottomBorder =
              (rowIndex + 1) % 3 === 0 && rowIndex !== 8;

            return (
              <TouchableOpacity
                key={`${rowIndex}-${colIndex}`}
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: errorCells.some(
                    ([r, c]) => r === rowIndex && c === colIndex
                  )
                    ? "#FF0000"
                    : isSelected
                    ? theme === "dark"
                      ? "#2C2C2C"
                      : "#E0E0E0"
                    : theme === "dark"
                    ? "#1C1C1C"
                    : "#F8F8F8",
                  borderWidth: 1,
                  borderRightWidth: isThickRightBorder ? 2 : 1,
                  borderBottomWidth: isThickBottomBorder ? 2 : 1,
                  borderColor: theme === "dark" ? "#FFFFFF" : "#000000",
                }}
                onPress={() => onCellPress(rowIndex, colIndex)}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: theme === "dark" ? "#FFFFFF" : "#000000",
                  }}
                >
                  {cell !== 0 ? cell : ""}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

export default SudokuGrid;

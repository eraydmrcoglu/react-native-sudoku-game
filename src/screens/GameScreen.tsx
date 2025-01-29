import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SudokuGrid from "../components/SudokuGrid";
import { generateSudokuBoard } from "../utils/boardGenerator";

const GameScreen = ({ navigation, route }: any) => {
  const { difficulty, incrementGamesWon } = route.params;
  const { board: initialBoard, solution } = generateSudokuBoard(difficulty);
  const [board, setBoard] = useState<number[][]>(initialBoard);
  const [usedHints, setUsedHints] = useState<[number, number][]>([]);
  const [history, setHistory] = useState<number[][][]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [errorCells, setErrorCells] = useState<[number, number][]>([]);
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(
    null
  );

  const [hintCount, setHintCount] = useState(
    difficulty === "Kolay" ? 3 : difficulty === "Orta" ? 2 : 1
  );

  const themeColors = {
    background: isDarkMode ? "#2C2C2C" : "#F5EDE4",
    text: isDarkMode ? "#F5EDE4" : "#815F42",
    gridBackground: isDarkMode ? "#3C3C3C" : "#FFF",
    buttonBackground: isDarkMode ? "#444444" : "#E6D7C3",
    buttonText: isDarkMode ? "#F5EDE4" : "#815F42",
  };

  const findErrors = (board: number[][]): [number, number][] => {
    const errors: [number, number][] = [];

    for (let i = 0; i < 9; i++) {
      const rowCheck = new Set<number>();
      const colCheck = new Set<number>();

      for (let j = 0; j < 9; j++) {
        if (board[i][j] !== 0) {
          if (rowCheck.has(board[i][j])) {
            errors.push([i, j]);
          } else {
            rowCheck.add(board[i][j]);
          }
        }

        if (board[j][i] !== 0) {
          if (colCheck.has(board[j][i])) {
            errors.push([j, i]);
          } else {
            colCheck.add(board[j][i]);
          }
        }
      }
    }

    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const boxCheck = new Set<number>();

        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const row = boxRow * 3 + i;
            const col = boxCol * 3 + j;
            if (board[row][col] !== 0) {
              if (boxCheck.has(board[row][col])) {
                errors.push([row, col]);
              } else {
                boxCheck.add(board[row][col]);
              }
            }
          }
        }
      }
    }
    return errors;
  };

  useEffect(() => {
    let timer: any;
    if (!isPaused) {
      timer = setInterval(() => setTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isPaused]);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const handleNumberPress = (num: number) => {
    if (!selectedCell) return;

    if (isPaused) {
      Alert.alert("Oyun Durduruldu", "Oyun duraklatılmış durumda!");
      return;
    }

    const [row, col] = selectedCell;
    const newHistory = [...history, JSON.parse(JSON.stringify(board))];
    const newBoard = [...board];
    newBoard[row][col] = num;
    setBoard(newBoard);
    setHistory(newHistory);
    setSelectedCell(null);
  };


  const showGameInfo = () => {
    Alert.alert(
      "Sudoku Kuralları",
      "Sudoku, her satır, her sütun ve her 3x3 alt karede 1'den 9'a kadar olan rakamları tekrar etmeden yerleştirmeniz gereken bir mantık oyunudur."
    );
  };

  const handleUndo = () => {
    if (history.length === 0) {
      Alert.alert("Geri Al", "Geri alabileceğiniz bir hamle bulunmuyor.");
      return;
    }

    const previousBoard = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setBoard(previousBoard);
  };

  const isValidHint = (row: number, col: number, num: number): boolean => {
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

  const handleHint = () => {
    if (hintCount <= 0) {
      Alert.alert("İpucu Hakkı Bitti", "Daha fazla ipucu hakkınız yok!");
      return;
    }

    if (usedHints.length >= 81) {
      Alert.alert("Sudoku Tamamlandı", "Tüm ipuçları zaten verildi!");
      return;
    }

    let hintGiven = false;

    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (
          board[row][col] === 0 &&
          !usedHints.some(([r, c]) => r === row && c === col)
        ) {
          const hintNumber = solution[row][col];

          if (isValidHint(row, col, hintNumber)) {
            Alert.alert(
              "İpucu",
              `(${row + 1}, ${col + 1}) hücresine ${hintNumber} yazabilirsiniz.`
            );

            setUsedHints((prevHints) => [...prevHints, [row, col]]);
            setHintCount((prevCount) => prevCount - 1);
            const newBoard = [...board];
            newBoard[row][col] = hintNumber;
            setBoard(newBoard);
            hintGiven = true;
            break;
          }
        }
      }
      if (hintGiven) break;
    }

    if (!hintGiven) {
      Alert.alert("Sudoku Çözüldü", "Tüm hücrelere ipucu verilmiş durumda!");
    }
  };

  const handleFinishGame = () => {
    const hasEmptyCells = board.some((row) => row.includes(0));
    if (hasEmptyCells) {
      Alert.alert(
        "Hata!",
        "Sudoku tamamlanmadı. Lütfen tüm hücreleri doldurun."
      );
      return;
    }

    const errors = findErrors(board);
    if (errors.length > 0) {
      setErrorCells(errors);
      Alert.alert(
        "Hata!",
        "Sudoku'da hatalar var. Lütfen kontrol edip tekrar deneyin."
      );
      return;
    }

    setErrorCells([]);
    const updatedGamesWon = route.params.gamesWon + 1;
    Alert.alert(
      "Tebrikler!",
      `Sudoku'yu başarıyla tamamladınız.\nToplam Süre: ${Math.floor(
        time / 60
      )}:${String(time % 60).padStart(2, "0")}`,
      [
        {
          text: "Ana Menüye Dön",
          onPress: () =>
            navigation.navigate("Home", { gamesWon: updatedGamesWon }),
        },
      ]
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: themeColors.background }}>
        {/* Üst Menü */}
        <View className="flex-row justify-between items-center w-full px-4 py-2 mt-12">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="arrow-back-outline"
              size={28}
              color={themeColors.text}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 18,
              color: themeColors.text,
              fontWeight: "bold",
            }}
          >
            {difficulty}
          </Text>
          <TouchableOpacity onPress={() => setIsPaused(!isPaused)}>
            <Ionicons
              name={isPaused ? "play-outline" : "pause-outline"}
              size={28}
              color={themeColors.text}
            />
          </TouchableOpacity>
        </View>

        {/* Orta İçerik */}
        <View className="flex-1 justify-center items-center px-4 mb-14">
          {/* Zamanlayıcı */}
          <Text
            style={{
              fontSize: 16,
              color: themeColors.text,
              fontWeight: "500",
              marginBottom: 16,
            }}
          >{`${Math.floor(time / 60)}:${String(time % 60).padStart(
            2,
            "0"
          )}`}</Text>

          {/* Sudoku Grid */}
          <View className="mb-4">
            <SudokuGrid
              board={board}
              selectedCell={selectedCell}
              errorCells={errorCells}
              onCellPress={(row, col) => {
                if (isPaused) {
                  Alert.alert("Oyun Durduruldu", "Oyun duraklatılmış durumda!");
                  return;
                }
                setSelectedCell([row, col]);
              }}
              theme={isDarkMode ? "dark" : "light"}
            />
          </View>

          {/* Alt Araç Çubuğu */}
          <View className="flex-row justify-between items-center w-full mb-4">
            {[
              { name: "arrow-undo-outline", onPress: handleUndo },
              {
                name: isDarkMode ? "sunny-outline" : "moon-outline",
                onPress: toggleTheme,
              },
              { name: "bulb-outline", onPress: handleHint },
              {
                name: "information-circle-outline",
                onPress: showGameInfo,
              },
            ].map((icon, index) => (
              <TouchableOpacity key={index} onPress={icon.onPress}>
                <View
                  className="w-12 h-12 rounded-full justify-center items-center"
                  style={{
                    backgroundColor: themeColors.buttonBackground,
                  }}
                >
                  <Ionicons
                    name={icon.name}
                    size={20}
                    color={themeColors.buttonText}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sayılar */}
          <View className="flex-row justify-around items-center w-full">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <TouchableOpacity
                key={num}
                className="w-9 h-10 rounded-lg justify-center items-center"
                style={{
                  backgroundColor: themeColors.buttonBackground,
                  borderWidth: 1,
                  borderColor: themeColors.text,
                }}
                onPress={() => handleNumberPress(num)}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    color: themeColors.buttonText,
                  }}
                >
                  {num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Oyunu Bitir Butonu */}
          <TouchableOpacity
            onPress={handleFinishGame}
            style={{
              marginTop: 30,
              backgroundColor: themeColors.buttonBackground,
              paddingVertical: 12,
              paddingHorizontal: 32,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: themeColors.buttonText,
                fontWeight: "bold",
              }}
            >
              Oyunu Bitir
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default GameScreen;

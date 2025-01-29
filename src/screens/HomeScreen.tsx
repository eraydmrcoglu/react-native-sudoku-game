import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "../components/Button";

const HomeScreen = ({ navigation }: any) => {
  const [gamesWon, setGamesWon] = useState(0);
  const [difficulty, setDifficulty] = useState("Orta");

  const difficulties = [
    { label: "Kolay", description: "Yeni başlayanlar için" },
    { label: "Orta", description: "Tecrübeli oyuncular için" },
    { label: "Zor", description: "Nihai meydan okuma" },
  ];

  const loadGamesWon = async () => {
    try {
      const storedGamesWon = await AsyncStorage.getItem("gamesWon");
      if (storedGamesWon) {
        setGamesWon(Number(storedGamesWon));
      }
    } catch (e) {
      console.error("Kazanılan oyun verisi yüklenemedi:", e);
    }
  };

  const saveGamesWon = async (newGamesWon: number) => {
    try {
      await AsyncStorage.setItem("gamesWon", newGamesWon.toString());
    } catch (e) {
      console.error("Kazanılan oyun verisi kaydedilemedi:", e);
    }
  };

  useEffect(() => {
    loadGamesWon();
  }, []);

  useEffect(() => {
    saveGamesWon(gamesWon);
  }, [gamesWon]);

  return (
    <View className="flex-1 bg-beige">
      <View className="absolute top-0 w-full h-1/3 bg-gradient-to-b from-light-brown to-beige rounded-b-3xl" />
      <View className="flex-1 justify-center items-center">
        {/* Üst Kısım */}
        <View className="items-center mb-8">
          <Ionicons name="grid-outline" size={80} color="#815F42" />
          <Text className="text-4xl font-bold text-brown mt-4">SUDOKU</Text>
          <Text className="text-lg text-brown mt-2">
            Toplam Kazanılan Oyun: {gamesWon}{" "}
          </Text>
        </View>

        {/* Zorluk Seçenekleri */}
        <Text className="text-lg text-brown font-bold text-center mb-6">
          ZORLUK SEÇİN
        </Text>
        <View className="w-4/5 space-y-4">
          {difficulties.map((item) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => setDifficulty(item.label)}
              style={{
                backgroundColor:
                  difficulty === item.label ? "#815F42" : "#F5EDE4",
                borderRadius: 16,
                padding: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: difficulty === item.label ? "white" : "#815F42",
                  marginBottom: 4,
                }}
              >
                {item.label}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: difficulty === item.label ? "white" : "#815F42",
                }}
              >
                {item.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Oyuna Başla Butonu */}
        <View className="mt-8 items-center">
          <Button
            title="OYUNA BAŞLA"
            onPress={() =>
              navigation.navigate("Game", {
                difficulty,
                incrementGamesWon: () =>
                  setGamesWon((prev) => {
                    const newGamesWon = prev + 1;
                    saveGamesWon(newGamesWon);
                    return newGamesWon;
                  }),
              })
            }
            backgroundColor="#815F42"
            textColor="white"
          />
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;

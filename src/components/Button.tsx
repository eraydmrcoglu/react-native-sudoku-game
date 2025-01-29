import React from "react";
import { TouchableOpacity, Text } from "react-native";

const Button = ({
  title,
  onPress,
  backgroundColor = "#815F42",
  textColor = "white",
}: {
  title: string;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor,
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }}
    >
      <Text style={{ color: textColor, fontSize: 16, fontWeight: "bold" }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

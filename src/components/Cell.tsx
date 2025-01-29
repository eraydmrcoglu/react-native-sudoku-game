import React from "react";
import { TextInput } from "react-native";

const Cell = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: string) => void;
}) => {
  return (
    <TextInput
      className="w-10 h-10 text-center text-lg border"
      keyboardType="numeric"
      maxLength={1}
      value={value === 0 ? "" : value.toString()}
      onChangeText={onChange}
    />
  );
};

export default Cell;

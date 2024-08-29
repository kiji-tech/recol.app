import React from "react";
import { Pressable, Text, View } from "react-native";

interface Props {
  text: string;
  theme?: "primary" | "secondary";
  onPress: () => void;
}
const Button = ({ text, theme = "primary", onPress = () => void 0 }: Props) => {
  return (
    <Pressable onPress={onPress}>
      <View
        className={`border-2 rounded-lg w-24 flex justify-center item-center px-4 py-2  ${
          theme == "primary"
            ? "bg-blue-500 border-blue-200 "
            : "bg-gray-200 border-gray-500"
        }`}
      >
        <Text
          className={`${
            theme == "primary" ? " color-white" : "color-black"
          } text-[16px]`}
        >
          {text}
        </Text>
      </View>
    </Pressable>
  );
};

export default Button;

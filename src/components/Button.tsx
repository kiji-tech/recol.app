import React from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

interface Props {
  text: string;
  theme?: "primary" | "secondary";
  onPress: () => void;
}
const Button = ({ text, theme = "primary", onPress = () => void 0 }: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        className={`border-2 rounded-lg w-40 flex justify-center item-center px-4 py-2  bg-light-${theme}-base`}
      >
        <Text className={`${theme === "primary" ? " color-white" : "color-black"} text-[16px] text-center`}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;

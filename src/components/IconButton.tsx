import React from "react";
import { Pressable, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type Props = {
  icon: string;
  text: string;
  onPress: () => void;
};
export default function IconButton({ icon, text, onPress }: Props) {
  return (
    <Pressable className="flex items-center justify-center" onPress={onPress}>
      <MaterialIcons name={icon as any} size={38} color="#25292e" />
      <Text>{text}</Text>
    </Pressable>
  );
}

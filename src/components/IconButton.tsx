import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

type Props = {
  icon: string;
  onPress: () => void;
};
export default function IconButton({ icon, onPress }: Props) {
  return (
    <TouchableOpacity
      className="flex items-center justify-center bg-white shadow-lg h-10 w-10 rounded-full"
      onPress={onPress}
    >
      <MaterialIcons name={icon as any} size={24} color="#25292e" />
    </TouchableOpacity>
  );
}

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Pressable, View } from "react-native";

type Props = {
  icon: string;
  onPress: () => void;
};
export default function CycleButton({ icon, onPress }: Props) {
  return (
    <View className="w-20 h-20 my-4 border-4 border-[#ffd33d]  rounded-full bg-white flex items-center justify-center">
      <Pressable onPress={onPress}>
        <MaterialIcons name={icon as any} size={38} color="#25292e" />
      </Pressable>
    </View>
  );
}

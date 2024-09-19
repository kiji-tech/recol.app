import IconButton from "@/src/components/IconButton";
import { Link, useRouter } from "expo-router";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Events() {
  const width = Dimensions.get("window").width / 2;
  const router = useRouter();

  return (
    <SafeAreaView>
      <View className="flex justify-start items-center flex-wrap p-4  h-full">
        <View className="flex flex-row justify-center flex-wrap">
          {[0, 1, 2, 3].map((i) => (
            <TouchableOpacity
              key={i}
              className={"bg-white shadow-lg h-[120px] w-1/3 m-4 p-2 rounded-lg"}
              onPress={() => {
                router.push({
                  pathname: "/(plan)/[id]/map",
                  params: {
                    id: i,
                  },
                });
              }}
            >
              <Text className="text-xl text-center">Events</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity>
            <IconButton icon="add" onPress={() => {router.push('/(add.plan)/add.plan')}} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '../../components/BottomSheet';
import { View, Text, SafeAreaView } from 'react-native';

export default function App() {
  return (
    <>
      <GestureHandlerRootView>
        <SafeAreaView>
          <View>
            <Text>Open up App.js to start working on your app!</Text>
          </View>
        </SafeAreaView>
        <BottomSheet />
      </GestureHandlerRootView>
    </>
  );
}

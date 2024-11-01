import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Text, SafeAreaView, Dimensions } from 'react-native';
import PlaceInfoBottomSheet from '../../components/GoogleMaps/PlaceInfoBottomSheet';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
export default function App() {
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  return (
    <>
      <GestureHandlerRootView>
        <SafeAreaView>
          <View style={{ width, height }}>
            <MapView
              style={{ width: '100%', height: '500px', flex: 1 }}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: 35.714,
                longitude: 139.4256,
                latitudeDelta: 0.0461,
                longitudeDelta: 0.021,
              }}
            />
          </View>
        </SafeAreaView>
        <PlaceInfoBottomSheet places={[]} onPress={() => {}} />
      </GestureHandlerRootView>
    </>
  );
}

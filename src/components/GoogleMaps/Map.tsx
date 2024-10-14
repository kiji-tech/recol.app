import React from 'react';
import { Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, type Region } from 'react-native-maps';

type Props = {
  region?: Region;
  places?: any;
  setRegion?: (region: Region) => void;
  selectPlace?: (place: any) => void;
  selectedPlace?: any;
  isMarker?: boolean;
};
export default function Map({
  region,
  places,
  setRegion = () => void 0,
  selectPlace = () => void 0,
  selectedPlace,
  isMarker = false,
}: Props) {
  return (
    <MapView
      style={{ height: '100%', width: '100%', flex: 1, borderRadius: 10 }}
      provider={PROVIDER_GOOGLE}
      initialRegion={region}
      region={region}
      onRegionChangeComplete={(region, { isGesture }) => {
        if (isGesture) setRegion(region);
      }}
    >
      {places?.map((place: any, index: number) => {
        return (
          <Marker
            key={place.id}
            onPress={() => selectPlace(place)}
            coordinate={{ ...place.location }}
          >
            {place && place.types && place.types.findIndex((t: any) => t == 'cafe') >= 0 && (
              <Image
                source={require('@/assets/images/mapicons/cafe.png')}
                style={{ width: 48, height: 48 }}
              />
            )}
          </Marker>
        );
      })}
    </MapView>
  );
}

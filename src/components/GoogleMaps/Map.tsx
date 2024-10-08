import React from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, type Region } from 'react-native-maps';

type Props = {
  region?: Region;
  places?: any;
  setRegion?: (region: Region) => void;
  selectPlace?: (place: any) => void;
  isMarker?: boolean;
};
export default function Map({
  region,
  places,
  setRegion = () => void 0,
  selectPlace = () => void 0,
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
            key={index}
            onPress={() => selectPlace(place)}
            coordinate={{
              latitude: place.location.latitude,
              longitude: place.location.longitude,
            }}
          />
        );
      })}
    </MapView>
  );
}

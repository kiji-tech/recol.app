import React from 'react';
import Map from '@/src/components/GoogleMaps/Map';
import { Place } from '@/src/entities/Place';
import { useState, useEffect } from 'react';
import {  View } from 'react-native';
import * as Location from 'expo-location';

type Props = {
  isOpen: boolean;
  placeList: Place[];
  onSuccess: (placeIdList: Place[]) => void;
  onClose: () => void;
};

export default function MapModal({ isOpen, placeList, onSuccess, onClose }: Props) {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedPlaceList, setSelectedPlaceList] = useState<Place[]>([]);

  // Location Permissions
  const [status, requestPermission] = Location.useForegroundPermissions();
  if (status == null) {
    requestPermission();
  }

  // ==== Method ====
  /** 場所を選択したときのイベントハンドラ */
  const handleSelectedPlace = (place: Place) => {
    setSelectedPlace(place);
  };

  const handleAdd = (place: Place) => {
    setSelectedPlaceList([...selectedPlaceList, place]);
  };
  const handleRemove = (place: Place) => {
    setSelectedPlaceList(selectedPlaceList.filter((p) => p.id !== place.id));
  };

  const handleClose = () => {
    onSuccess(selectedPlaceList);
  };

  useEffect(() => {
    setSelectedPlaceList([...placeList]);
  }, [placeList]);

  if (!isOpen) {
    return <></>;
  }

  return (
    <>
      <View className=" w-screen h-screen absolute top-0 left-0">
        <Map
          isSearch={true}
          selectedPlace={selectedPlace}
          selectedPlaceList={selectedPlaceList}
          onSelectPlace={(place: Place) => handleSelectedPlace(place)}
          onMarkerDeselect={() => {
            // setSelectedPlace(null);
          }}
          onAdd={handleAdd}
          onRemove={handleRemove}
          onBack={handleClose}
        />
      </View>
    </>
  );
}

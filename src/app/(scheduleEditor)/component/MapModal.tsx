import React from 'react';
import Map from '@/src/components/GoogleMaps/Map';
import ModalLayout from '@/src/components/Modal/ModalLayout';
import PlaceCard from '@/src/components/PlaceCard';
import { Place } from '@/src/entities/Place';
import { useState, useEffect } from 'react';
import { Modal, SafeAreaView, Text, View } from 'react-native';
import * as Location from 'expo-location';
import MapBottomSheet from '@/src/components/GoogleMaps/BottomSheet/MapBottomSheet';

type Props = {
  isOpen: boolean;
  placeList: Place[];
  onSuccess: (placeIdList: Place[]) => void;
  onClose: () => void;
};

export default function MapModal({ isOpen, placeList, onSuccess, onClose }: Props) {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedPlaceList, setSelectedPlaceList] = useState<Place[]>(placeList);

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

  /** */
  const handleClose = () => {
    onSuccess(selectedPlaceList);
    onClose();
  };

  if (!isOpen) {
    return <></>;
  }

  return (
    <>
      <View className=" w-screen h-screen shadow-xl absolute top-0 left-0">
        <Map
          isSearch={true}
          selectedPlace={selectedPlace}
          selectedPlaceList={selectedPlaceList}
          onSelectPlace={(place: Place) => handleSelectedPlace(place)}
          onMarkerDeselect={() => {
            // setSelectedPlace(null);
          }}
          onBack={onClose}
        />
      </View>
    </>
  );
}

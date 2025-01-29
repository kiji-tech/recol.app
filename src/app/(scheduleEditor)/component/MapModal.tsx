import React from 'react';
import Map from '@/src/components/GoogleMaps/Map';
import ModalLayout from '@/src/components/Modal/ModalLayout';
import PlaceCard from '@/src/components/PlaceCard';
import { Place } from '@/src/entities/Place';
import { useState, useEffect } from 'react';
import { Modal, Text, View } from 'react-native';
import * as Location from 'expo-location';

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

  return (
    <>
      <Modal visible={isOpen} animationType={'slide'} transparent={true}>
        <ModalLayout size={'full'} onClose={handleClose}>
          <View className=" w-full h-[50%]">
            <Map
              isSearch={true}
              selectedPlace={selectedPlace}
              selectedPlaceList={selectedPlaceList}
              onSelectPlace={(place: Place) => handleSelectedPlace(place)}
              onMarkerDeselect={() => {
                // setSelectedPlace(null);
              }}
            />
          </View>
          {/* 選択対象の表示 */}
          <PlaceCard
            place={selectedPlace}
            selected={selectedPlaceList.some((p) => p.id === selectedPlace?.id)}
            onAddPlace={(place) => setSelectedPlaceList((prev) => [...prev, place])}
            onRemovePlace={(place) =>
              setSelectedPlaceList((prev) => prev.filter((p) => p.id !== place.id))
            }
          />
          {/* 選択中の場所の数 */}
          {selectedPlaceList.length > 0 && (
            <View className="w-8 h-8 rounded-full bg-light-theme dark:bg-dark-theme">
              <Text className="text-bold text-center text-lg text-light-text dark:text-dark-text">
                {selectedPlaceList.length}
              </Text>
            </View>
          )}

          {/* ローディング */}
        </ModalLayout>
      </Modal>
    </>
  );
}

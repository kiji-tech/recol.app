import React from 'react';
import BottomSheetLayout from '../../BottomSheetLayout';
import PlaceCard from './PlaceCard';
import PlaceCardHeader from './PlaceCardHerader';
import PlaceCardBody from './PlaceCardBody';

type Props = {
  onSelectedList: () => void;
};
export default function MapBottomSheet({ onSelectedList }: Props) {
  return (
    <BottomSheetLayout>
      <PlaceCardHeader onSelectedList={onSelectedList} />
      <PlaceCardBody />
    </BottomSheetLayout>
  );
}

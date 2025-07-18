import React from 'react';
import { Platform, View } from 'react-native';
import Header from '../Header/Header';

type MapSearchBarProps = {
  onSearch: (text: string) => void;
  onBack: () => void;
};
export default function MapSearchBar({
  onSearch = () => void 0,
  onBack = () => void 0,
}: MapSearchBarProps) {
  const platform = Platform.OS;
  // === Member ===

  return <></>;
}

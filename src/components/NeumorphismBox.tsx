import React from 'react';
import { View } from 'react-native';

type NeumorphismBoxProps = {
  children: React.ReactNode;
  className?: string;
};

export default function NeumorphismBox({ children, className }: NeumorphismBoxProps) {
  return (
    <View
      className={`bg-light-background dark:bg-dark-background
        border border-light-border dark:border-dark-border 
        rounded-xl overflow-hidden ${className}`}
    >
      {children}
    </View>
  );
}

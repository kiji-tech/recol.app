import React from 'react';
import { View, Text } from 'react-native';

type BadgeProps = {
  text: string;
  className?: string;
};

const Badge: React.FC<BadgeProps> = ({ text, className = '' }) => {
  return (
    <View
      className={`rounded-full px-4 py-1 self-start bg-light-theme dark:bg-dark-theme ${className}`}
    >
      <Text className="text-sm font-medium text-light-text dark:text-dark-text">{text}</Text>
    </View>
  );
};

export default Badge;

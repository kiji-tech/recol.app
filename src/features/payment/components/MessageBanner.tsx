import React from 'react';
import { Text, View } from 'react-native';

interface MessageBannerProps {
  mainText: string;
  subText?: string;
  backgroundColor?: string;
  textColor?: string;
  icon?: string;
  showDots?: boolean;
  className?: string;
}

export default function MessageBanner({
  mainText,
  subText,
  backgroundColor = '#10B981',
  textColor = 'white',
  icon = '🎉',
  showDots = true,
  className = 'mt-2 mx-1',
}: MessageBannerProps) {
  return (
    <View className={className}>
      <View
        className="rounded-lg px-3 py-2 shadow-sm"
        style={{
          backgroundColor,
          shadowColor: backgroundColor,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <View className="flex-row items-center justify-center">
          {showDots && (
            <View
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
            />
          )}
          <Text className="text-sm font-semibold text-center" style={{ color: textColor }}>
            {icon} {mainText}
          </Text>
          {showDots && (
            <View
              className="w-2 h-2 rounded-full ml-2"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
            />
          )}
        </View>
        {subText && (
          <Text className="text-xs text-center mt-1" style={{ color: `${textColor}90` }}>
            {subText}
          </Text>
        )}
      </View>
    </View>
  );
}

// 従来のTrialMessageの使用例
interface TrialMessageProps {
  isMonthly: boolean;
  isCurrentPlan: boolean;
}

export function TrialMessage({ isMonthly, isCurrentPlan }: TrialMessageProps) {
  if (!isMonthly || isCurrentPlan) {
    return null;
  }

  return (
    <MessageBanner
      mainText="1ヶ月お試しで始められます"
      subText="いつでもキャンセル可能"
      backgroundColor="#10B981"
      icon="🎉"
    />
  );
}

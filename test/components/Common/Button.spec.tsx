import React from 'react';
import { Button } from '@/src/components';
import { ThemeProvider } from '@/src/contexts/ThemeContext';
import { render } from '@testing-library/react-native';
import { fireEvent } from '@testing-library/react-native';

describe('##### Button Test #####', () => {
  describe('success test', () => {
    test('onPressに設定したメソッドが実行されること', async () => {
      const onClickMock = jest.fn();
      const { getByText } = render(<Button onPress={onClickMock} text="test" />, {
        wrapper: ThemeProvider,
      });
      const button = getByText('test');
      fireEvent.press(button);

      expect(onClickMock).toHaveBeenCalledTimes(1);
      expect(button).toBeTruthy();
    });
  });
});

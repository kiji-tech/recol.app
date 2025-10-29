import React from 'react';
import { MockProfileFactory } from '../../mocks/mockProfiles';
import { MyBannerAd } from '@/src/components/Ad/BannerAd';
import { render, renderHook, waitFor } from '@testing-library/react-native';
import { useAuth } from '@/src/features/auth';

// useAuthフックをモック
// const mockUseAuth = jest.fn();
// jest.mock('@/src/features/auth', () => ({
//   useAuth: mockUseAuth,
// }));

describe('BannerAd Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('プレミアムプランのユーザーの場合はBannerAdが表示されること', async () => {
    // プレミアムユーザーのプロフィールを作成
    const premiumProfile = MockProfileFactory.createPremiumUser();
    // useAuthのモックを設定
    const { result } = renderHook(() => useAuth());
    //   result.current.setProfile(premiumProfile);
    const r = render(<MyBannerAd />);

    await waitFor(() => {
      expect(r).toBeNull();
    });
    expect(result.current.profile).toBe(premiumProfile);
  });

  test('プレミアムプランのユーザーではない場合はBannerAdが表示されないこと', async () => {
    // 非プレミアムユーザーのプロフィールを作成
    const nonPremiumProfile = MockProfileFactory.createFreeUser();

    // useAuthのモックを設定
    // mockUseAuth.mockReturnValue(MockAuthFactory.createMockAuth(nonPremiumProfile));

    // Profile.isPremiumUser()の結果をテスト
    expect(nonPremiumProfile.isPremiumUser()).toBe(false);
  });
});

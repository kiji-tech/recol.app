# テストモック

このディレクトリには、テストで共通して使用するモックが含まれています。

## 使用方法

### MockProfileFactory

プロフィールのモックを作成するためのファクトリクラスです。

```typescript
import { MockProfileFactory } from '../utils/mockProfiles';

// プレミアムユーザーを作成
const premiumUser = MockProfileFactory.createPremiumUser();

// フリーユーザーを作成
const freeUser = MockProfileFactory.createFreeUser();

// 管理者ユーザーを作成
const adminUser = MockProfileFactory.createAdminUser();

// カスタムプロパティでオーバーライド
const customUser = MockProfileFactory.createPremiumUser({
  display_name: 'カスタムユーザー',
  uid: 'custom-uid',
});
```

### MockAuthFactory

useAuthフックのモックを作成するためのファクトリクラスです。

```typescript
import { MockAuthFactory } from '../utils/mockAuth';

// 基本的なモック
const mockAuth = MockAuthFactory.createMockAuth(premiumUser);

// ローディング状態のモック
const loadingAuth = MockAuthFactory.createLoadingAuth();

// 未初期化状態のモック
const uninitializedAuth = MockAuthFactory.createUninitializedAuth();
```

## 利用可能なメソッド

### MockProfileFactory

- `createPremiumUser(overrides?)` - プレミアムユーザー
- `createFreeUser(overrides?)` - フリーユーザー
- `createAdminUser(overrides?)` - 管理者ユーザー
- `createSuperUser(overrides?)` - スーパーユーザー
- `createExpiredPremiumUser(overrides?)` - 期限切れプレミアムユーザー
- `createDeletedUser(overrides?)` - 削除済みユーザー

### MockAuthFactory

- `createMockAuth(profile?)` - 基本的な認証モック
- `createLoadingAuth(profile?)` - ローディング状態の認証モック
- `createUninitializedAuth(profile?)` - 未初期化状態の認証モック

## 使用例

```typescript
import { MockProfileFactory, MockAuthFactory } from '../mocks';

// useAuthフックをモック
const mockUseAuth = jest.fn();
jest.mock('@/src/features/auth', () => ({
  useAuth: mockUseAuth,
}));

describe('MyComponent Test', () => {
  test('プレミアムユーザーの場合のテスト', () => {
    const premiumUser = MockProfileFactory.createPremiumUser();
    const mockAuth = MockAuthFactory.createMockAuth(premiumUser);

    mockUseAuth.mockReturnValue(mockAuth);

    // テストロジック
    expect(premiumUser.isPremiumUser()).toBe(true);
  });
});
```

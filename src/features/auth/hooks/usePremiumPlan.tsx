import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { LogUtil } from '@/src/libs/LogUtil';
import { Platform } from 'react-native';
import Purchases, {
  CustomerInfo,
  PurchasesOfferings,
  PurchasesPackage,
} from 'react-native-purchases';
import dayjs from 'dayjs';

type PremiumPlanContextType = {
  isPremium: boolean; // プレミアムユーザーかどうか
  activePlanId: string | null; // 現在のプランID
  managementURL: string | null; // 管理URL
  premiumPlanList: PurchasesPackage[];
  endAt: Date | null; // プレミアムプランの有効期限
  customerInfo: CustomerInfo | null; // 顧客情報
  onSubmit: (purchasesPackage: PurchasesPackage) => Promise<void>; // プレミアムプランの購入
  onRefetch: () => void; // プレミアムプランの再取得
  setPremiumPlanList: (premiumPlanList: PurchasesPackage[]) => void; // プレミアムプランリストの設定
};

const PremiumPlanContext = createContext<PremiumPlanContextType | undefined>(undefined);

/**
 * プレミアムプランコンテキスト
 * @param children {React.ReactNode} 子要素
 * @returns {React.ReactNode} プレミアムプランプロバイダー
 */
export const PremiumPlanProvider = ({ children }: { children: React.ReactNode }) => {
  const IS_PREMIUM_USER = true;
  const [isPremium, setIsPremium] = useState(false);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [managementURL, setManagementURL] = useState<string | null>(null);
  const [premiumPlanList, setPremiumPlanList] = useState<PurchasesPackage[]>([]);
  const [endAt, setEndAt] = useState<Date | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  // すでにプレミアム会員になっているかどうか判定しています
  const checkPremium = (customerInfo: CustomerInfo) => {
    if (customerInfo.activeSubscriptions.length > 0) {
      return IS_PREMIUM_USER;
    }
    return !IS_PREMIUM_USER;
  };

  /** RevenueCat 初期化 */
  const initRevenueCat = async () => {
    try {
      // react-native-purchases初期化
      //   Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

      let apiKey = process.env.EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY || '';
      if (Platform.OS === 'android') {
        apiKey = process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY || '';
      }

      if (!apiKey) {
        LogUtil.log('RevenueCat API key is not configured', { level: 'error' });
        return false;
      }
      Purchases.configure({ apiKey });

      LogUtil.log('RevenueCat initialized successfully', { level: 'info' });
      return true;
    } catch (error) {
      LogUtil.log('RevenueCat initialization failed: ' + JSON.stringify(error), {
        level: 'warn',
      });
      return false;
    }
  };

  /**
   * RevenueCat 顧客情報取得
   * ユーザー情報の取得・プレミアムプランの判定
   */
  const setupCustomerInfo = useCallback(async () => {
    const customerInfo = await Purchases.getCustomerInfo();
    setIsPremium(checkPremium(customerInfo));
    setManagementURL(customerInfo.managementURL || null);
    setActivePlanId(customerInfo.activeSubscriptions[0] || null);
    setEndAt(
      customerInfo.latestExpirationDate ? dayjs(customerInfo.latestExpirationDate).toDate() : null
    );
    setCustomerInfo(customerInfo);
  }, []);

  /**
   * RevenueCat プレミアムプランの情報の取得・設定処理
   * Offeringオブジェクトを取得して設定する
   */
  const setupOfferings = async () => {
    const offerings: PurchasesOfferings = await Purchases.getOfferings();
    console.log({ offerings: JSON.stringify(offerings) });
    setPremiumPlanList(offerings.current?.availablePackages || []);
  };

  /**
   * プレミアムプランの購入処理
   * @param purchasesPackage: {PurchasesPackage} 購入パッケージ ･･･ android,ios 月額,年額
   */
  const onSubmit = useCallback(async (purchasesPackage: PurchasesPackage) => {
    // 購入処理
    await Purchases.purchasePackage(purchasesPackage);
    await setupCustomerInfo();
  }, []);

  const onRefetch = async () => {
    await setupCustomerInfo();
  };

  /**
   * RevenueCat 初期化・プレミアムプランリストの取得・顧客情報の取得
   */
  useEffect(() => {
    (async () => {
      await initRevenueCat();
      await setupOfferings();
      await setupCustomerInfo();
    })();
  }, []);

  return (
    <PremiumPlanContext.Provider
      value={{
        isPremium,
        activePlanId,
        managementURL,
        premiumPlanList,
        endAt,
        customerInfo,
        onSubmit,
        onRefetch,
        setPremiumPlanList,
      }}
    >
      {children}
    </PremiumPlanContext.Provider>
  );
};

export const usePremiumPlan = () => {
  const context = useContext(PremiumPlanContext);
  if (!context) throw new Error('usePremiumPlan must be used within a PremiumPlanProvider');
  return context;
};

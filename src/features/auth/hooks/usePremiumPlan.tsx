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
  isPremium: boolean;
  activePlanId: string | null;
  managementURL: string | null;
  premiumPlanList: PurchasesPackage[];
  endAt: Date | null;
  customerInfo: CustomerInfo | null;
  onSubmit: (purchasesPackage: PurchasesPackage) => Promise<void>;
  onRefetch: () => void;
  setPremiumPlanList: (premiumPlanList: PurchasesPackage[]) => void;
};

const PremiumPlanContext = createContext<PremiumPlanContextType | undefined>(undefined);

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

      let apiKey = '';
      if (Platform.OS === 'ios') {
        apiKey = process.env.EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY || '';
      } else if (Platform.OS === 'android') {
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
        level: 'error',
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
    console.log('customerInfo', JSON.stringify(customerInfo));
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

import { LogUtil } from '@/src/libs/LogUtil';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Purchases, {
  CustomerInfo,
  LOG_LEVEL,
  PurchasesOffering,
  PurchasesOfferings,
  PurchasesPackage,
} from 'react-native-purchases';

type PremiumPlanContextType = {
  isPremium: boolean;
  onSubmit: (purchasesPackage: PurchasesPackage) => Promise<void>;
  onPressRestore: () => Promise<void>;
  premiumPlanList: PurchasesOffering | null;
  setPremiumPlanList: (premiumPlanList: PurchasesOffering | null) => void;
};

const PremiumPlanContext = createContext<PremiumPlanContextType | undefined>(undefined);

export const PremiumPlanProvider = ({ children }: { children: React.ReactNode }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [premiumPlanList, setPremiumPlanList] = useState<PurchasesOffering | null>(null);

  // すでにプレミアム会員になっているかどうか判定しています
  const checkPremium = (customerInfo: CustomerInfo) => {
    LogUtil.log('checkPremium customerInfo: ' + JSON.stringify(customerInfo), {
      level: 'info',
    });
    if (typeof customerInfo.entitlements.active.Premium !== 'undefined') {
      return true;
    }
  };

  const initRevenueCat = async () => {
    try {
      // react-native-purchases初期化
      Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

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

  const setupCustomerInfo = async () => {
    const customerInfo = await Purchases.getCustomerInfo();
    LogUtil.log('RevenueCat customerInfo: ' + JSON.stringify(customerInfo), {
      level: 'info',
    });
    if (checkPremium(customerInfo)) {
      setIsPremium(true);
    }
  };

  const setupOfferings = async () => {
    const offerings: PurchasesOfferings = await Purchases.getOfferings();
    setPremiumPlanList(offerings.current || null);
  };

  const onSubmit = useCallback(async (purchasesPackage: PurchasesPackage) => {
    // 購入処理
    const { customerInfo } = await Purchases.purchasePackage(purchasesPackage);
    if (checkPremium(customerInfo)) {
      setIsPremium(true);
    }
  }, []);

  // Restoreの実装をしています
  const onPressRestore = useCallback(async () => {
    const restore = await Purchases.restorePurchases();
    if (checkPremium(restore)) {
      setIsPremium(true);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await initRevenueCat();
      await setupCustomerInfo();
      await setupOfferings();
    })();
  }, []);

  return (
    <PremiumPlanContext.Provider
      value={{ isPremium, onSubmit, onPressRestore, premiumPlanList, setPremiumPlanList }}
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

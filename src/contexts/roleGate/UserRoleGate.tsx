import { useRouter } from 'expo-router';
import { useAuth } from '../../features/auth';
import { Enums } from '@/src/libs/database.types';
import { useEffect } from 'react';

export const useUserRoleGate = async (allowed: Enums<'Role'>[]) => {
  const { profile } = useAuth();
  const router = useRouter();

  if (!profile) {
    router.navigate('/(auth)/SignIn');
  }

  useEffect(() => {
    if (profile && !allowed.includes(profile.role!)) {
      router.navigate('/NotFound');
    }
  }, [profile]);
};

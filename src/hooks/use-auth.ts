
'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { isAdmin, getAdminPermissions, AdminPermissions } from '@/lib/firebase/services';

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  permissions: AdminPermissions | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAdmin: false,
    permissions: null,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const adminStatus = await isAdmin(currentUser.uid);
        let adminPermissions: AdminPermissions | null = null;
        if (adminStatus) {
            adminPermissions = await getAdminPermissions(currentUser.uid);
        }
        setAuthState({
          user: currentUser,
          isAdmin: adminStatus,
          permissions: adminPermissions,
          loading: false,
        });
      } else {
        setAuthState({
          user: null,
          isAdmin: false,
          permissions: null,
          loading: false,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return authState;
}

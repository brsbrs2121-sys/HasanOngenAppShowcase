
'use client';

import { createContext, useContext, ReactNode, useMemo, useState, useEffect, useCallback } from 'react';
import type { User, UserRole } from '@/lib/types';
import {
  onAuthStateChanged,
  signOut,
  type User as FirebaseUser,
  RecaptchaVerifier,
  signInWithPhoneNumber as webSignInWithPhoneNumber,
  ConfirmationResult,
  deleteUser,
} from 'firebase/auth';
import { doc, onSnapshot, getDoc, setDoc, serverTimestamp, deleteDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { useRouter } from 'next/navigation';
import { usePersistentState } from '@/hooks/use-persistent-state';
import { getMockData, initialMockDemoDatabase, setMockData } from './mock-demo-data';
import { useToast } from '@/hooks/use-toast';
import { FirebaseErrorListener } from './FirebaseErrorListener';
import { Network, ConnectionStatus } from '@capacitor/network';
import type { PluginListenerHandle } from '@capacitor/core';

// Network Context
interface NetworkContextValue {
  isOnline: boolean;
}

const NetworkContext = createContext<NetworkContextValue>({ isOnline: true });

export const useNetwork = () => useContext(NetworkContext);

const NetworkProvider = ({ children }: { children: ReactNode }) => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleStatusChange = (status: ConnectionStatus) => {
      setIsOnline(status.connected);
    };

    const setupNetworkListener = async () => {
        const status = await Network.getStatus();
        handleStatusChange(status);
        const listener = await Network.addListener('networkStatusChange', handleStatusChange);
        
        return listener;
    };

    const listenerPromise = setupNetworkListener();

    return () => {
      listenerPromise.then(listener => {
          if (listener) {
              listener.remove();
          }
      });
    };
  }, []);

  const value = useMemo(() => ({ isOnline }), [isOnline]);

  return (
    <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
  );
};


interface FirebaseContextValue {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isDemoMode: boolean;
  loginWithPhoneNumber: (phone: string) => Promise<boolean>;
  registerUser: (phone: string, role: UserRole, data: Pick<User, 'firstName' | 'lastName'>) => Promise<boolean>;
  confirmOtp: (
    otp: string,
    type: 'login' | 'register',
    registrationData?: Pick<User, 'firstName' | 'lastName'>
  ) => Promise<FirebaseUser | null>;
  loginAsMockUser: (role: 'customer' | 'superadmin') => Promise<void>;
  logout: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextValue | undefined>(undefined);

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

interface PendingRegistrationData {
    firstName: string;
    lastName: string;
    role: UserRole;
}

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = usePersistentState<boolean>('isDemoMode', false);
  const [pendingRegistrationData, setPendingRegistrationData] = useState<PendingRegistrationData | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    let unsubSnapshot: null | (() => void) = null;

    if (isDemoMode) {
      const role = localStorage.getItem('demoUserRole');
      if (role) {
        const db = getMockData();
        const u = db.users?.find((x) => x.role === role) || null;
        setUser(u);
      }
      setIsLoading(false);
      return;
    }

    const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (unsubSnapshot) { unsubSnapshot(); unsubSnapshot = null; }

      setFirebaseUser(fbUser);

      if (!fbUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const ref = doc(db, 'users', fbUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists() && snap.data().status === 'pending-deletion') {
        try {
          await signOut(auth);
          toast({
            title: "Hesap Silinmiş",
            description: "Bu hesap silinmek üzere işaretlenmiş veya silinmiş.",
            variant: "destructive"
          });
        } catch {}
        setUser(null);
        setIsLoading(false);
        return;
      }

      unsubSnapshot = onSnapshot(ref, (docSnap) => {
        if (docSnap.exists()) setUser({ id: docSnap.id, ...docSnap.data() } as User);
        else setUser(null);
        setIsLoading(false);
      });
    });

    return () => {
      unsubAuth();
      if (unsubSnapshot) unsubSnapshot();
    };
  }, [isDemoMode, toast]);

  const logout = useCallback(async () => {
    if (isDemoMode) {
      setIsDemoMode(false);
      setUser(null);
      localStorage.removeItem('demoUserRole');
      router.replace('/login');
      return;
    }
    await signOut(auth);
    router.replace('/login');
  }, [isDemoMode, router, setIsDemoMode]);

  const loginWithPhoneNumber = useCallback(async (phone: string): Promise<boolean> => {
    try {
      if (typeof window === 'undefined') throw new Error('Window object is not available.');
      
      const recaptchaContainer = document.getElementById('recaptcha-container');
      if (!recaptchaContainer) {
          throw new Error('reCAPTCHA container not found.');
      }

      let verifier: RecaptchaVerifier;

      if (!window.recaptchaVerifier) {
        verifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
        window.recaptchaVerifier = verifier;
      } else {
        verifier = window.recaptchaVerifier;
      }

      window.confirmationResult = await webSignInWithPhoneNumber(auth, phone, verifier);
      console.log('Web confirmationResult created successfully.');
      return true;

    } catch (err: any) {
      console.error('SMS Send ERROR:', err);
      
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        delete window.recaptchaVerifier;
      }
      
      let msg = 'SMS gönderilemedi. Lütfen tekrar deneyin.';
      if (err?.code === 'auth/too-many-requests') msg = 'Çok fazla deneme yapıldı. Lütfen daha sonra tekrar deneyin.';
      if (err?.code === 'auth/captcha-check-failed' || err.message.includes('reCAPTCHA has already been rendered')) {
          msg = 'Güvenlik doğrulaması başarısız oldu. Lütfen sayfayı yenileyip tekrar deneyin.';
      }

      toast({ variant: 'destructive', title: 'Hata', description: msg });
      return false;
    }
  }, [toast]);

  const registerUser = useCallback(async (phone: string, role: UserRole, data: Pick<User, 'firstName' | 'lastName'>) => {
    setPendingRegistrationData({ ...data, role });
    return await loginWithPhoneNumber(phone);
  }, [loginWithPhoneNumber]);

  const confirmOtp = useCallback(async (
    otp: string,
    type: 'login' | 'register',
    registrationData?: Pick<User, 'firstName' | 'lastName'>,
  ): Promise<FirebaseUser | null> => {
    try {
      if (typeof window === 'undefined' || !window.confirmationResult) {
        toast({ variant: 'destructive', title: 'Hata', description: 'Doğrulama oturumu süresi doldu. Lütfen tekrar deneyin.' });
        return null;
      }
      const result = await window.confirmationResult.confirm(otp);
      const fbUser = result.user;

      if (!fbUser) return null;

      if (type === 'register' && pendingRegistrationData) {
        const userRef = doc(db, 'users', fbUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          toast({ variant: 'destructive', title: 'Hata', description: 'Bu telefon numarası zaten kayıtlı.' });
          await signOut(auth);
          return null;
        }
        
        const newUser: Omit<User, 'id'> = {
          firstName: pendingRegistrationData.firstName,
          lastName: pendingRegistrationData.lastName,
          phoneNumber: fbUser.phoneNumber!,
          role: pendingRegistrationData.role,
          status: 'active',
          hasAcceptedPrivacyPolicy: true,
          createdAt: serverTimestamp() as Timestamp,
        };

        await setDoc(userRef, newUser);
        setPendingRegistrationData(null); // Clear pending data
      }

      return fbUser;

    } catch (err: any) {
      console.error('OTP Confirm ERROR:', err);
      toast({ variant: 'destructive', title: 'Geçersiz Kod', description: 'Girdiğiniz kod hatalı. Lütfen tekrar deneyin.' });
      return null;
    }
  }, [toast, pendingRegistrationData]);

  const loginAsMockUser = useCallback(async (role: 'customer' | 'superadmin') => {
    // Clear old mock database from localStorage to ensure fresh data
    localStorage.removeItem('mockDatabase');
    
    setMockData(initialMockDemoDatabase);

    const db = getMockData();
    const u = db.users?.find((x) => x.role === role);
    if (u) {
      localStorage.setItem('demoUserRole', role);
      setIsDemoMode(true);
    }
  }, [setIsDemoMode]);

  const value = useMemo(
    () => ({
      user,
      firebaseUser,
      isLoading,
      isDemoMode,
      loginWithPhoneNumber,
      registerUser,
      confirmOtp,
      loginAsMockUser,
      logout,
    }),
    [user, firebaseUser, isLoading, isDemoMode, logout, loginWithPhoneNumber, registerUser, confirmOtp, loginAsMockUser]
  );

  return (
    <NetworkProvider>
        <FirebaseContext.Provider value={value}>
        {children}
        <div id="recaptcha-container"></div>
        <FirebaseErrorListener />
        </FirebaseContext.Provider>
    </NetworkProvider>
  );
}

export function useFirebase() {
  const ctx = useContext(FirebaseContext);
  if (!ctx) throw new Error('useFirebase must be used inside a FirebaseProvider component');
  return ctx;
}

export function useUser() {
  const ctx = useFirebase();
  return { user: ctx.user, isLoading: ctx.isLoading, isDemoMode: ctx.isDemoMode };
}

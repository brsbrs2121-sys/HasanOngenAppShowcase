
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  getDoc,
  getDocs,
  Timestamp,
  serverTimestamp,
  deleteField,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { useFirebase, useNetwork } from './FirebaseProvider';
import {
  getMockData,
  findMockUserByPhone,
  addMockDocument,
  updateMockDocument as mockUpdate,
  deleteMockDocument,
  writeBatchMockDocuments,
  addMockDataListener,
  removeMockDataListener,
} from './mock-demo-data';
import type { User } from '../types';

const reviver = (key: string, value: any) => {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
    return new Date(value);
  }
  return value;
};

export function useCollection<T extends { id: string }>(
  path: string,
  filterKey?: 'barbers' | 'customers' | 'main',
  cacheKey?: string
) {
  const { isDemoMode } = useFirebase();
  const { isOnline } = useNetwork();
  
  const [data, setData] = useState<T[]>(() => {
    if (!cacheKey || typeof window === 'undefined') return [];
    try {
      const cachedData = localStorage.getItem(cacheKey);
      return cachedData ? JSON.parse(cachedData, reviver) : [];
    } catch (error) {
      console.warn(`Failed to parse cache for ${cacheKey}:`, error);
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    
    // Always start with loading true, but only if we don't have cached data
    setIsLoading(data.length === 0);

    if (isDemoMode) {
      const fetchMockData = () => {
        const mockData = getMockData();
        let collectionData = mockData[path] || [];

        if (path === 'users' && filterKey) {
          if (filterKey === 'barbers') {
            collectionData = collectionData.filter(u => u.role === 'barber' || u.role === 'superadmin');
          } else if (filterKey === 'customers') {
            collectionData = collectionData.filter(u => u.role === 'customer');
          }
        } else if (path === 'settings' && filterKey === 'main') {
          collectionData = collectionData.filter(s => s.id === 'main');
        }
        
        setData(collectionData);
        setIsLoading(false);
      };

      fetchMockData();
      const listener = () => fetchMockData();
      addMockDataListener(listener);
      unsubscribe = () => removeMockDataListener(listener);
      
    } else { // Live Mode
      
      if (!isOnline) {
        setIsLoading(false);
        // Data is already loaded from cache in useState initializer, so we just stop here.
      /*
      
        120 lines of codes
      
      */
export const writeBatchDocuments = async (collectionPath: string, updates: {id: string, data: any}[]) => {
    const { isDemoMode } = getFirebaseContext();
    if (isDemoMode) {
        return writeBatchMockDocuments(collectionPath, updates);
    }
    const batch = writeBatch(db);
    updates.forEach(update => {
        const docRef = doc(db, collectionPath, update.id);
        batch.update(docRef, update.data);
    });
    return await batch.commit();
};

export const findUserByPhone = async (phoneNumber: string): Promise<User | null> => {
    const { isDemoMode } = getFirebaseContext();
    if (isDemoMode) {
        return findMockUserByPhone(phoneNumber);
    }
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('phoneNumber', '==', phoneNumber));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return { id: userDoc.id, ...userDoc.data() } as User;
    }
    return null;
}

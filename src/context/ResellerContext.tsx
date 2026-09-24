'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Product } from '@/types/marketplace';
import { ResellerProfile, ResellerProduct, ResellerPlanType } from '@/types/reseller';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';

interface ResellerContextType {
  isReseller: boolean;
  resellerProfile: ResellerProfile | null;
  products: ResellerProduct[];
  isLoading: boolean;
  registerReseller: (data: {
    fullName: string;
    email: string;
    phone: string;
    storeName: string;
    password?: string;
    referralCode?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  addProductToCatalog: (
    product: Product,
    suggestedPrice: number,
    description?: string
  ) => Promise<{ success: boolean; id?: string }>;
  quickGenerateLandingPage: (product: Product) => Promise<{ storeSlug: string; productSlug: string } | null>;
  refreshResellerData: () => Promise<void>;
}

const ResellerContext = createContext<ResellerContextType | undefined>(undefined);

export function ResellerProvider({ children }: { children: React.ReactNode }) {
  const { user, userProfile, isAuthenticated, role } = useAuth();
  const [resellerProfile, setResellerProfile] = useState<ResellerProfile | null>(null);
  const [products, setProducts] = useState<ResellerProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isReseller = Boolean(
    role === 'reseller' ||
    userProfile?.role === 'reseller' ||
    resellerProfile?.status === 'active'
  );

  // Sync reseller profile from Firestore
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setResellerProfile(null);
      setProducts([]);
      return;
    }

    const resellerRef = doc(db, 'resellers', user.uid);
    const unsub = onSnapshot(resellerRef, (snap) => {
      if (snap.exists()) {
        setResellerProfile(snap.data() as ResellerProfile);
      } else if (role === 'reseller' || userProfile?.role === 'reseller') {
        const storeSlug = (user.displayName || 'store').toLowerCase().replace(/[^a-z0-9]/g, '-');
        const defaultProfile: ResellerProfile = {
          id: user.uid,
          firebaseUid: user.uid,
          storeName: user.displayName ? `${user.displayName}'s Store` : 'My Reseller Store',
          storeSlug,
          plan: 'starter',
          status: 'active',
          walletBalance: 0,
          totalEarnings: 0,
          totalOrders: 0,
          createdAt: new Date().toISOString(),
        };
        setResellerProfile(defaultProfile);
        setDoc(resellerRef, defaultProfile).catch(console.error);
      }
    });

    return () => unsub();
  }, [isAuthenticated, user, role, userProfile]);

  // Sync reseller inventory from Firestore
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'reseller_products'), where('resellerId', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const items: ResellerProduct[] = [];
      snap.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      setProducts(items);
    });
    return () => unsub();
  }, [user]);

  const registerReseller = async (data: {
    fullName: string;
    email: string;
    phone: string;
    storeName: string;
    password?: string;
    referralCode?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const uid = user?.uid || `reseller_${Date.now()}`;
      const storeSlug = data.storeName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const newProfile: ResellerProfile = {
        id: uid,
        firebaseUid: uid,
        storeName: data.storeName,
        storeSlug,
        plan: 'starter',
        status: 'active',
        contactPhone: data.phone,
        email: data.email,
        walletBalance: 0,
        totalEarnings: 0,
        totalOrders: 0,
        createdAt: new Date().toISOString(),
      };

      if (user) {
        await setDoc(doc(db, 'resellers', user.uid), newProfile);
        await updateDoc(doc(db, 'users', user.uid), { role: 'reseller' });
      }
      setResellerProfile(newProfile);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to register reseller.' };
    } finally {
      setIsLoading(false);
    }
  };

  const addProductToCatalog = async (
    product: Product,
    suggestedPrice: number,
    description?: string
  ): Promise<{ success: boolean; id?: string }> => {
    if (!user) return { success: false };
    try {
      const id = `rp_${user.uid}_${product.id}`;
      const wholesalePrice = product.supplierPrice || Math.round(product.price * 0.75);
      const newProduct: ResellerProduct = {
        id,
        resellerId: user.uid,
        originalProductId: product.id,
        productName: product.name,
        category: product.category,
        customPrice: suggestedPrice,
        suggestedPrice,
        wholesalePrice,
        resellerProfit: Math.max(0, suggestedPrice - wholesalePrice),
        description: description || product.description,
        imageUrl: product.imageUrl,
        isActive: true,
        createdAt: new Date().toISOString(),
        landingPageEnabled: true,
      };

      await setDoc(doc(db, 'reseller_products', id), newProduct);
      return { success: true, id };
    } catch (err) {
      console.error('Failed to add product to catalog:', err);
      return { success: false };
    }
  };

  const quickGenerateLandingPage = async (
    product: Product
  ): Promise<{ storeSlug: string; productSlug: string } | null> => {
    const storeSlug = resellerProfile?.storeSlug || 'store';
    const productSlug = product.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    await addProductToCatalog(product, product.suggestedPrice || product.price);
    return { storeSlug, productSlug };
  };

  const refreshResellerData = async () => {
    if (!user) return;
    try {
      const snap = await getDoc(doc(db, 'resellers', user.uid));
      if (snap.exists()) {
        setResellerProfile(snap.data() as ResellerProfile);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ResellerContext.Provider
      value={{
        isReseller,
        resellerProfile,
        products,
        isLoading,
        registerReseller,
        addProductToCatalog,
        quickGenerateLandingPage,
        refreshResellerData,
      }}
    >
      {children}
    </ResellerContext.Provider>
  );
}

export function useReseller() {
  const context = useContext(ResellerContext);
  if (!context) {
    throw new Error('useReseller must be used within a ResellerProvider');
  }
  return context;
}

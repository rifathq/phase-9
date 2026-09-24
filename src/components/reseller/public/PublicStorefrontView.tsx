'use client';

import React, { useState, useEffect } from 'react';
import { useMarketplace } from '@/context/MarketplaceContext';
import { ProductCard } from '@/components/common/ProductCard';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Store, ShieldCheck, ShoppingBag, ArrowLeft, Phone } from 'lucide-react';
import { ResellerProfile, ResellerProduct } from '@/types/reseller';

interface PublicStorefrontViewProps {
  storeSlug?: string;
}

export function PublicStorefrontView({ storeSlug }: PublicStorefrontViewProps) {
  const { products, navigate } = useMarketplace();
  const [storeData, setStoreData] = useState<ResellerProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!storeSlug) return;
    const fetchStore = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'resellers'), where('storeSlug', '==', storeSlug));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setStoreData(snap.docs[0].data() as ResellerProfile);
        }
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, [storeSlug]);

  const displayProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen bg-white">
      {/* Storefront Header */}
      <div className="border-b border-neutral-200 bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-900 shadow-xs">
                <Store className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-neutral-900">
                    {storeData?.storeName || (storeSlug ? `${storeSlug.replace(/-/g, ' ').toUpperCase()} STORE` : 'Reseller Online Store')}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Partner
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Cash on Delivery available nationwide across Bangladesh
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('home')}
              className="text-xs font-bold text-neutral-600 hover:text-neutral-900"
            >
              Zero Invest Marketplace
            </button>
          </div>
        </div>
      </div>

      {/* Catalog */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-neutral-900">Store Products</h2>
          <span className="text-xs text-neutral-500">{displayProducts.length} Items Available</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {displayProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

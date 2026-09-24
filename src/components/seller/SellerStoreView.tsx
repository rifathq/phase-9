'use client';

import React from 'react';
import { useMarketplace } from '@/context/MarketplaceContext';
import { ProductCard } from '@/components/common/ProductCard';
import { Store, Star, MapPin, ShieldCheck, ArrowLeft, Package } from 'lucide-react';

export function SellerStoreView() {
  const { selectedSeller, sellers, products, navigate } = useMarketplace();
  const seller = selectedSeller || sellers[0];
  const sellerProducts = products.filter(p => p.sellerId === seller?.id);

  if (!seller) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold">Store Not Found</h2>
        <button
          onClick={() => navigate('sellers')}
          className="mt-4 px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold"
        >
          Back to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => navigate('sellers')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>All Verified Sellers</span>
      </button>

      {/* Seller Header Banner */}
      <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-8 mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FAF9F5] border border-neutral-200 flex items-center justify-center text-neutral-900 shrink-0">
              <Store className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-neutral-900">{seller.storeName}</h1>
                {seller.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Supplier
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  {seller.location || 'Dhaka, Bangladesh'}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <strong className="text-neutral-900">{seller.rating?.toFixed(1) || '4.8'}</strong> ({seller.reviewCount || 45} reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="text-xs bg-[#FAF9F5] border border-neutral-200 px-4 py-2 rounded-xl text-neutral-700 font-semibold">
            {sellerProducts.length} Products in Catalog
          </div>
        </div>

        {seller.description && (
          <p className="text-xs text-neutral-600 mt-4 pt-4 border-t border-neutral-100 max-w-3xl leading-relaxed">
            {seller.description}
          </p>
        )}
      </div>

      {/* Seller Products Catalog */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-neutral-700" />
          <h2 className="text-lg font-bold text-neutral-900">Products from this Seller</h2>
        </div>

        {sellerProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-neutral-200 text-xs text-neutral-500">
            No products available from this seller at this time.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {sellerProducts.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

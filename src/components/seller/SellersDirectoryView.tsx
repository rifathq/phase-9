'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/context/MarketplaceContext';
import { Store, Star, MapPin, ArrowRight, ShieldCheck, Search } from 'lucide-react';

export function SellersDirectoryView() {
  const { sellers, navigate } = useMarketplace();
  const [search, setSearch] = useState('');

  const filtered = sellers.filter(s => 
    s.storeName.toLowerCase().includes(search.toLowerCase()) ||
    s.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            Verified Artisan &amp; Supplier Stores
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Browse local merchants, manufacturers, and authorized distributors across Bangladesh
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stores or cities..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-neutral-200 bg-white focus:outline-none focus:border-neutral-900 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((seller) => (
          <div
            key={seller.id}
            onClick={() => navigate('seller-store', { sellerId: seller.id })}
            className="bg-white border border-neutral-200/90 hover:border-neutral-900 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#FAF9F5] border border-neutral-200 flex items-center justify-center text-neutral-900">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-neutral-900 group-hover:text-[#C98F6B] transition-colors">
                      {seller.storeName}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-neutral-500 mt-0.5">
                      <MapPin className="w-3 h-3 text-neutral-400" />
                      <span>{seller.location || 'Dhaka, Bangladesh'}</span>
                    </div>
                  </div>
                </div>
                {seller.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>

              <p className="text-xs text-neutral-600 line-clamp-2 mb-4 leading-relaxed">
                {seller.description || 'Verified manufacturer and wholesale supplier on Zero Invest Marketplace.'}
              </p>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="font-bold text-neutral-900">{seller.rating?.toFixed(1) || '4.8'}</span>
                <span className="text-neutral-400 text-[11px]">({seller.reviewCount || 45})</span>
              </div>

              <div className="flex items-center gap-1 font-bold text-neutral-900 group-hover:translate-x-0.5 transition-transform">
                <span>Visit Store</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

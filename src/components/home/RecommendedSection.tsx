'use client';

import React from 'react';
import { useMarketplace } from '@/context/MarketplaceContext';
import { ProductCard } from '@/components/common/ProductCard';
import { Sparkles, ArrowRight } from 'lucide-react';

export function RecommendedSection() {
  const { products, navigate } = useMarketplace();
  const recommended = products.filter(p => p.isRecommended || p.rating >= 4.5).slice(0, 4);

  if (recommended.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C98F6B] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Curated For You
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
            Recommended Products
          </h2>
        </div>
        <button
          onClick={() => navigate('shop')}
          className="text-xs sm:text-sm font-bold text-neutral-900 hover:text-neutral-600 flex items-center gap-1 group cursor-pointer"
        >
          <span>Explore Catalog</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
        {recommended.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

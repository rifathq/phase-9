'use client';

import React from 'react';
import { useMarketplace } from '@/context/MarketplaceContext';
import { 
  Sparkles, 
  Shirt, 
  Watch, 
  Headphones, 
  Home, 
  ShoppingBag, 
  ArrowRight,
  Gem,
  Palette
} from 'lucide-react';

const CATEGORY_ITEMS = [
  { id: 'fashion', name: 'Fashion & Apparel', icon: Shirt, count: '140+ Items' },
  { id: 'electronics', name: 'Smart Electronics', icon: Headphones, count: '95+ Items' },
  { id: 'accessories', name: 'Watches & Jewelry', icon: Watch, count: '68+ Items' },
  { id: 'home', name: 'Home & Living', icon: Home, count: '82+ Items' },
  { id: 'beauty', name: 'Beauty & Cosmetics', icon: Sparkles, count: '110+ Items' },
  { id: 'lifestyle', name: 'Lifestyle & Crafts', icon: Palette, count: '74+ Items' },
];

export function ShopByCategory() {
  const { navigate } = useMarketplace();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
            Shop by Category
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Discover verified supplier collections across Bangladesh
          </p>
        </div>
        <button
          onClick={() => navigate('shop')}
          className="text-xs sm:text-sm font-bold text-neutral-900 hover:text-neutral-600 flex items-center gap-1 group cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
        {CATEGORY_ITEMS.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              onClick={() => navigate('shop', { category: cat.id })}
              className="bg-neutral-50/80 hover:bg-white border border-neutral-200/80 hover:border-neutral-900 p-4 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all hover:shadow-md group"
            >
              <div className="w-12 h-12 rounded-xl bg-white group-hover:bg-neutral-900 border border-neutral-200 group-hover:border-neutral-900 text-neutral-800 group-hover:text-white flex items-center justify-center mb-3 transition-colors shadow-xs">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-neutral-900 group-hover:text-neutral-950 line-clamp-1">
                {cat.name}
              </h3>
              <span className="text-[10px] text-neutral-400 mt-0.5 font-medium">
                {cat.count}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import { useMarketplace } from '@/context/MarketplaceContext';
import { Product } from '@/types/marketplace';
import { Truck, ShieldCheck, CheckCircle2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { formatBDT } from '@/lib/formatters';

interface PublicLandingPageViewProps {
  storeSlug?: string;
  productSlug?: string;
}

export function PublicLandingPageView({ storeSlug, productSlug }: PublicLandingPageViewProps) {
  const { products, addToCart, navigate } = useMarketplace();

  // Find product by slug or default to first
  const product: Product = products.find(p => 
    productSlug && p.name.toLowerCase().replace(/[^a-z0-9]/g, '-').includes(productSlug.toLowerCase())
  ) || products[0];

  const handleBuyNow = () => {
    addToCart(product, 1);
    navigate('checkout');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Banner */}
      <div className="bg-[#111111] text-white text-center py-2 px-4 text-xs font-semibold">
        Cash on Delivery Available Nationwide in Bangladesh · 100% Quality Guaranteed
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => navigate('reseller-public-store', { storeSlug })}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Store</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="aspect-square bg-neutral-100 rounded-3xl overflow-hidden border border-neutral-200">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C98F6B]">
                {product.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 mt-1">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-3xl font-black text-neutral-900">
                  {formatBDT(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-neutral-400 line-through">
                    {formatBDT(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              {product.description}
            </p>

            {/* Value Props */}
            <div className="space-y-2.5 pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Fast doorstep delivery in 2-4 business days</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Pay on delivery after inspecting parcel condition</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>7-day easy replacement guarantee</span>
              </div>
            </div>

            {/* Instant COD Order Button */}
            <div className="pt-4">
              <button
                onClick={handleBuyNow}
                className="w-full py-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Order Now (Cash on Delivery)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useReseller } from '@/context/ResellerContext';
import { useAuth } from '@/context/AuthContext';
import { useMarketplace } from '@/context/MarketplaceContext';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Wallet, 
  Globe, 
  Settings, 
  LogOut, 
  ExternalLink,
  Plus,
  ArrowRight,
  TrendingUp,
  Share2,
  Copy
} from 'lucide-react';
import { formatBDT } from '@/lib/formatters';

export function ResellerPortalLayout() {
  const { resellerProfile, products, isReseller } = useReseller();
  const { user, logout } = useAuth();
  const { navigate, showToast } = useMarketplace();
  const [activeTab, setActiveTab] = useState<'overview' | 'catalog' | 'orders' | 'wallet'>('overview');

  const storeSlug = resellerProfile?.storeSlug || 'store';
  const publicStoreUrl = `${window.location.origin}/store/${storeSlug}`;

  const handleCopyStoreLink = () => {
    navigator.clipboard.writeText(publicStoreUrl);
    showToast('Link Copied!', 'Your public store link has been copied to clipboard.', 'success');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-neutral-200 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('home')}
            className="text-xs font-bold text-neutral-600 hover:text-neutral-900 cursor-pointer"
          >
            ← Back to Marketplace
          </button>
          <span className="text-neutral-300">|</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-black text-neutral-900 tracking-wider uppercase">
              Reseller Portal: {resellerProfile?.storeName || 'My Store'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={handleCopyStoreLink}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-neutral-600" />
            <span>Copy Storefront URL</span>
          </button>
          <button
            onClick={() => navigate('reseller-public-store', { storeSlug })}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer"
          >
            <span>View Public Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col md:flex-row gap-6">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-60 shrink-0 space-y-2">
          <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'overview' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'catalog' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>My Catalog ({products.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'orders' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Customer Orders</span>
            </button>
            <button
              onClick={() => setActiveTab('wallet')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'wallet' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>Wallet &amp; Payouts</span>
            </button>
          </div>

          <button
            onClick={() => navigate('shop')}
            className="w-full py-2.5 px-3 bg-[#C98F6B] hover:bg-[#b57a55] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Browse Wholesale Products</span>
          </button>
        </aside>

        {/* Tab Content */}
        <main className="flex-1 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
                  <div className="text-xs text-neutral-400 font-bold uppercase">Wallet Balance</div>
                  <div className="text-2xl font-black text-neutral-900 mt-1">
                    {formatBDT(resellerProfile?.walletBalance || 0)}
                  </div>
                  <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
                    Ready for bKash withdrawal
                  </span>
                </div>
                <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
                  <div className="text-xs text-neutral-400 font-bold uppercase">Total Lifetime Profit</div>
                  <div className="text-2xl font-black text-neutral-900 mt-1">
                    {formatBDT(resellerProfile?.totalEarnings || 0)}
                  </div>
                  <span className="text-[11px] text-neutral-500 font-semibold mt-0.5 block">
                    Zero inventory capital invested
                  </span>
                </div>
                <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
                  <div className="text-xs text-neutral-400 font-bold uppercase">Catalog Products</div>
                  <div className="text-2xl font-black text-neutral-900 mt-1">
                    {products.length}
                  </div>
                  <span className="text-[11px] text-neutral-500 font-semibold mt-0.5 block">
                    Active in your storefront
                  </span>
                </div>
              </div>

              {/* Public Storefront Banner */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">Your Shareable Public Store</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Customers from any device or browser can browse your products and place Cash on Delivery orders.
                  </p>
                  <p className="text-xs font-mono text-neutral-800 bg-[#FAF9F5] px-3 py-1.5 rounded-lg mt-2 border border-neutral-200 inline-block">
                    /store/{storeSlug}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyStoreLink}
                    className="px-3 py-2 border border-neutral-200 rounded-xl text-xs font-bold hover:bg-neutral-50 cursor-pointer"
                  >
                    Copy Link
                  </button>
                  <button
                    onClick={() => navigate('reseller-public-store', { storeSlug })}
                    className="px-3 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 cursor-pointer"
                  >
                    Open Store
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'catalog' && (
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-neutral-900">My Reseller Products</h3>
                <button
                  onClick={() => navigate('shop')}
                  className="px-3 py-1.5 bg-neutral-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  + Add More Products
                </button>
              </div>

              {products.length === 0 ? (
                <div className="py-12 text-center text-xs text-neutral-500 space-y-2">
                  <p>You haven't added any products to your catalog yet.</p>
                  <button
                    onClick={() => navigate('shop')}
                    className="text-xs font-bold text-[#C98F6B] underline cursor-pointer"
                  >
                    Explore Wholesale Catalog
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {products.map((p) => (
                    <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xs font-bold text-neutral-900">{p.productName}</h4>
                        <div className="text-[11px] text-neutral-500 flex gap-3 mt-0.5">
                          <span>Selling Price: {formatBDT(p.customPrice)}</span>
                          <span>Wholesale: {formatBDT(p.wholesalePrice)}</span>
                          <span className="text-emerald-600 font-bold">Profit: {formatBDT(p.resellerProfit)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate('reseller-public-landing', {
                          storeSlug,
                          productSlug: p.productName.toLowerCase().replace(/[^a-z0-9]/g, '-')
                        })}
                        className="px-2.5 py-1 text-xs font-semibold border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer"
                      >
                        Landing Page
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs text-center py-12 text-xs text-neutral-500">
              <ShoppingBag className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
              <p className="font-semibold text-neutral-700">No customer orders placed yet.</p>
              <p className="mt-1">Share your product landing page or storefront link to start receiving sales.</p>
            </div>
          )}

          {activeTab === 'wallet' && (
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-neutral-900">Wallet &amp; Disbursement</h3>
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-neutral-200 flex justify-between items-center">
                <div>
                  <span className="text-xs text-neutral-500">Available Balance</span>
                  <div className="text-xl font-black text-neutral-900">{formatBDT(resellerProfile?.walletBalance || 0)}</div>
                </div>
                <button
                  onClick={() => showToast('Withdrawal', 'Minimum withdrawal threshold is ৳500 via bKash/Nagad.', 'info')}
                  className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Request Payout
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

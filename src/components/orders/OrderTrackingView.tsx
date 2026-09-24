'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/context/MarketplaceContext';
import { orderApi } from '@/services';
import { Order, SellerOrder } from '@/types/marketplace';
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, AlertCircle, ArrowRight } from 'lucide-react';
import { formatBDT } from '@/lib/formatters';

export function OrderTrackingView() {
  const { orders, navigate } = useMarketplace();
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [matchedOrder, setMatchedOrder] = useState<Order | null>(null);
  const [matchedSub, setMatchedSub] = useState<SellerOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setSearched(true);
    const result = await orderApi.trackOrder(query, orders);
    if (result) {
      setMatchedOrder(result.order);
      setMatchedSub(result.matchedSubOrder || null);
    } else {
      setMatchedOrder(null);
      setMatchedSub(null);
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center max-w-lg mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF9F5] border border-neutral-200 text-neutral-800">
          <Truck className="w-3.5 h-3.5 text-neutral-900" />
          <span>Real-time Parcel Tracking</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
          Track Your Order
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          Enter your Order Number (e.g. ZI-1001) or Courier Consignment / Tracking ID
        </p>

        <form onSubmit={handleTrack} className="flex gap-2 pt-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. ZI-4821 or TRK-..."
              className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-xl border border-neutral-200 bg-white focus:outline-none focus:border-neutral-900 transition-colors shadow-xs"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-neutral-900 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-neutral-800 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {isLoading ? 'Searching...' : 'Track Parcel'}
          </button>
        </form>
      </div>

      {searched && !matchedOrder && !isLoading && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center space-y-2 max-w-md mx-auto">
          <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
          <h3 className="text-sm font-bold text-amber-900">No Tracking Records Found</h3>
          <p className="text-xs text-amber-800">
            We couldn't find an order matching "{query}". Please verify your order confirmation SMS/email or contact customer care.
          </p>
        </div>
      )}

      {matchedOrder && (
        <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-400 uppercase">Order ID</span>
                <span className="text-base font-black text-neutral-900">{matchedOrder.orderNumber}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-neutral-100 text-neutral-800">
                  {matchedOrder.status}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Placed on {matchedOrder.createdAt} · Courier Partner: {matchedOrder.carrier || 'Steadfast Courier'}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-neutral-400 block">Total Amount</span>
              <span className="text-lg font-black text-neutral-900">{formatBDT(matchedOrder.total)}</span>
            </div>
          </div>

          {/* Tracking Step Progress */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Delivery Status</h4>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 font-bold border border-emerald-200 flex flex-col items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Confirmed</span>
              </div>
              <div className={`p-3 rounded-xl font-bold flex flex-col items-center gap-1 ${
                matchedOrder.status !== 'Pending' 
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
                  : 'bg-neutral-50 text-neutral-400 border border-neutral-200'
              }`}>
                <Package className="w-4 h-4" />
                <span>Packed</span>
              </div>
              <div className={`p-3 rounded-xl font-bold flex flex-col items-center gap-1 ${
                matchedOrder.status === 'Shipped' || matchedOrder.status === 'Delivered'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
                  : 'bg-neutral-50 text-neutral-400 border border-neutral-200'
              }`}>
                <Truck className="w-4 h-4" />
                <span>On The Way</span>
              </div>
              <div className={`p-3 rounded-xl font-bold flex flex-col items-center gap-1 ${
                matchedOrder.status === 'Delivered'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
                  : 'bg-neutral-50 text-neutral-400 border border-neutral-200'
              }`}>
                <CheckCircle2 className="w-4 h-4" />
                <span>Delivered</span>
              </div>
            </div>
          </div>

          {/* Delivery Address & Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-100 text-xs">
            <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-neutral-200">
              <div className="flex items-center gap-1.5 font-bold text-neutral-900 mb-1">
                <MapPin className="w-4 h-4 text-neutral-700" />
                <span>Delivery Address</span>
              </div>
              <p className="text-neutral-600 leading-relaxed">
                {matchedOrder.shippingAddress?.address}<br />
                {matchedOrder.shippingAddress?.city}, {matchedOrder.shippingAddress?.district || 'Bangladesh'}<br />
                Recipient: {matchedOrder.customerName} ({matchedOrder.shippingAddress?.phone})
              </p>
            </div>

            <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-neutral-200">
              <div className="flex items-center gap-1.5 font-bold text-neutral-900 mb-1">
                <Clock className="w-4 h-4 text-neutral-700" />
                <span>Fulfillment Details</span>
              </div>
              <p className="text-neutral-600 leading-relaxed">
                Tracking Number: {matchedOrder.trackingNumber || 'Assigned on courier pickup'}<br />
                Estimated Delivery: {matchedOrder.deliveryDate || '2 - 4 business days'}<br />
                Payment: {matchedOrder.paymentMethod} ({matchedOrder.paymentStatus})
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { OrderStatus } from '@/types/marketplace';
import { 
  Search, 
  Filter, 
  ShoppingBag, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  RotateCcw, 
  Clock, 
  Eye, 
  ExternalLink,
  Shield,
  FileText,
  AlertCircle
} from 'lucide-react';

const COURIER_OPTIONS = [
  'Steadfast Courier',
  'Pathao Courier',
  'RedX Delivery',
  'Paperfly',
  'Sundarban Courier Service',
  'SA Paribahan',
  'eCourier',
  'Direct / In-House Delivery'
];

export function OrdersTab() {
  const { orders, isLoadingOrders, updateOrderStatus, isSubmitting } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  // Selected order for inspection & status update modal
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [modalStatus, setModalStatus] = useState<OrderStatus>('Pending');
  const [modalCourier, setModalCourier] = useState<string>('');
  const [modalTracking, setModalTracking] = useState<string>('');
  const [modalNotes, setModalNotes] = useState<string>('');

  const openOrderModal = (order: any) => {
    setSelectedOrder(order);
    setModalStatus(order.status || 'Pending');
    setModalCourier(order.courier || '');
    setModalTracking(order.trackingNumber || '');
    setModalNotes(order.adminNotes || '');
  };

  const closeOrderModal = () => {
    setSelectedOrder(null);
  };

  const handleSaveOperationalUpdates = async () => {
    if (!selectedOrder) return;
    const ok = await updateOrderStatus(
      selectedOrder.id,
      modalStatus,
      modalCourier.trim() || undefined,
      modalTracking.trim() || undefined,
      modalNotes.trim() || undefined
    );
    if (ok) {
      closeOrderModal();
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const num = String(order.orderNumber || '').toLowerCase();
        const custName = String(order.customerName || '').toLowerCase();
        const custPhone = String(order.customerPhone || '').toLowerCase();
        const resellerId = String(order.resellerId || '').toLowerCase();
        const storeName = String(order.storeName || '').toLowerCase();
        const matches = num.includes(q) || custName.includes(q) || custPhone.includes(q) || resellerId.includes(q) || storeName.includes(q);
        if (!matches) return false;
      }

      // Status filter
      if (statusFilter !== 'all' && order.status !== statusFilter) {
        return false;
      }

      // Payment filter
      if (paymentFilter !== 'all' && order.paymentMethod !== paymentFilter) {
        return false;
      }

      return true;
    });
  }, [orders, searchQuery, statusFilter, paymentFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Controls */}
      <div className="bg-white border border-[#E6E4E0] rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#111111]">Platform Orders Management</h2>
            <p className="text-xs text-neutral-500">
              Manage operational fulfillment across all marketplace stores and reseller landing pages.
            </p>
          </div>
          <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#F7F6F3] border border-[#E6E4E0] text-neutral-700 self-start sm:self-auto">
            {filteredOrders.length} {filteredOrders.length === 1 ? 'Order' : 'Orders'} displayed
          </div>
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order #, customer, phone..."
              className="w-full pl-9.5 pr-4 py-2 text-xs rounded-xl border border-[#E6E4E0] bg-[#F7F6F3] focus:bg-white focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E4E0] bg-[#F7F6F3] focus:bg-white focus:outline-none font-medium text-neutral-800"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Returned">Returned</option>
            </select>
          </div>

          <div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E4E0] bg-[#F7F6F3] focus:bg-white focus:outline-none font-medium text-neutral-800"
            >
              <option value="all">All Payment Methods</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="bKash">bKash</option>
              <option value="Nagad">Nagad</option>
              <option value="Rocket">Rocket</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#E6E4E0] rounded-2xl shadow-xs overflow-hidden">
        {isLoadingOrders ? (
          <div className="py-16 text-center text-xs text-neutral-500">
            Loading orders from Firestore...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <ShoppingBag className="w-8 h-8 text-neutral-300 mx-auto" />
            <p className="text-xs font-semibold text-neutral-700">No matching orders found</p>
            <p className="text-[11px] text-neutral-500 max-w-sm mx-auto">
              Try adjusting your search criteria or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F6F3] border-b border-[#E6E4E0] text-neutral-600 font-semibold">
                <tr>
                  <th className="py-3 px-4">Order Details</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Reseller Store</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Fulfillment Status</th>
                  <th className="py-3 px-4">Courier / Tracking</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF9F5] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-neutral-900">
                        #{order.orderNumber || order.id?.substring(0, 8)}
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">
                        {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Recent'}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                        ID: {order.id?.substring(0, 12)}...
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-neutral-900">{order.customerName || 'Customer'}</div>
                      <div className="text-neutral-600 text-[11px] font-mono">{order.customerPhone || 'No phone'}</div>
                      <div className="text-[10px] text-neutral-500 truncate max-w-[140px]">{order.customerCity || order.shippingAddress?.city || 'Dhaka'}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-neutral-800">{order.storeName || 'Marketplace Direct'}</div>
                      <div className="text-[10px] text-neutral-400 font-mono">
                        {order.resellerId ? `Reseller: ${order.resellerId.substring(0, 8)}...` : 'Platform Direct'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-neutral-900">
                        ৳{Number(order.totalAmountBDT || order.total || 0).toLocaleString()}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-medium">
                        {order.paymentMethod || 'Cash on Delivery'}
                      </div>
                      {order.isSettled ? (
                        <span className="inline-block mt-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                          Settled
                        </span>
                      ) : (
                        <span className="inline-block mt-0.5 text-[9px] font-bold text-neutral-500 bg-neutral-100 px-1.5 py-0.2 rounded">
                          Unsettled
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Processing' ? 'bg-amber-100 text-amber-800' :
                        order.status === 'Confirmed' ? 'bg-indigo-100 text-indigo-800' :
                        order.status === 'Cancelled' || order.status === 'Returned' ? 'bg-rose-100 text-rose-800' :
                        'bg-neutral-100 text-neutral-800'
                      }`}>
                        {order.status || 'Pending'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {order.courier ? (
                        <div>
                          <div className="font-semibold text-neutral-800">{order.courier}</div>
                          <div className="text-[10px] text-neutral-500 font-mono">{order.trackingNumber || 'Pending code'}</div>
                        </div>
                      ) : (
                        <span className="text-neutral-400 italic text-[11px]">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openOrderModal(order)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Operational Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#E6E4E0] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-[#E6E4E0] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                  Order Management
                </span>
                <h3 className="text-lg font-bold text-[#111111] mt-0.5">
                  Order #{selectedOrder.orderNumber || selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={closeOrderModal}
                className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs">
              {/* Financial Immutability Notice */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-amber-800 leading-relaxed">
                  <strong>Security Guard:</strong> Financial totals (৳{Number(selectedOrder.totalAmountBDT || selectedOrder.total || 0).toLocaleString()}), ordered items, customer ID, and reseller ID are immutable by Firestore security rules. Only operational fulfillment details can be updated.
                </p>
              </div>

              {/* Customer & Shipping Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F7F6F3] p-4 rounded-xl border border-[#E6E4E0]">
                <div>
                  <h4 className="font-bold text-neutral-900 mb-1">Customer Details</h4>
                  <p className="text-neutral-700 font-semibold">{selectedOrder.customerName || 'Customer'}</p>
                  <p className="text-neutral-600 font-mono">{selectedOrder.customerPhone || 'N/A'}</p>
                  <p className="text-neutral-500">{selectedOrder.customerEmail || 'Guest checkout'}</p>
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900 mb-1">Delivery Address</h4>
                  <p className="text-neutral-700">{selectedOrder.customerAddress || selectedOrder.shippingAddress?.street || 'N/A'}</p>
                  <p className="text-neutral-600">
                    {[selectedOrder.customerCity, selectedOrder.customerDistrict, selectedOrder.customerDivision]
                      .filter(Boolean).join(', ') || selectedOrder.shippingAddress?.city || 'Dhaka, Bangladesh'}
                  </p>
                </div>
              </div>

              {/* Order Items Breakdown */}
              <div>
                <h4 className="font-bold text-neutral-900 mb-2">Ordered Items ({selectedOrder.items?.length || 0})</h4>
                <div className="border border-[#E6E4E0] rounded-xl divide-y divide-neutral-100 overflow-hidden">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between gap-3 bg-white">
                      <div className="flex items-center gap-2.5">
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover border border-neutral-200" />
                        )}
                        <div>
                          <p className="font-semibold text-neutral-900">{item.name || item.productName}</p>
                          <p className="text-[10px] text-neutral-500">
                            Qty: {item.quantity} · Price: ৳{item.price?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right font-bold text-neutral-900">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Operational Fields Editor */}
              <div className="space-y-3 pt-2 border-t border-[#E6E4E0]">
                <h4 className="font-bold text-neutral-900">Fulfillment Status &amp; Courier Dispatch</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-neutral-700 block mb-1">Operational Status</label>
                    <select
                      value={modalStatus}
                      onChange={(e) => setModalStatus(e.target.value as OrderStatus)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E4E0] bg-white focus:outline-none focus:border-black font-medium"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Returned">Returned</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-700 block mb-1">Designated Courier</label>
                    <select
                      value={modalCourier}
                      onChange={(e) => setModalCourier(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E4E0] bg-white focus:outline-none focus:border-black font-medium"
                    >
                      <option value="">Select Courier...</option>
                      {COURIER_OPTIONS.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Courier Tracking Number / Consignment ID</label>
                  <input
                    type="text"
                    value={modalTracking}
                    onChange={(e) => setModalTracking(e.target.value)}
                    placeholder="e.g. STEAD-774921 or PATHAO-TRK-990"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E4E0] bg-white focus:outline-none focus:border-black font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Admin / Operational Notes</label>
                  <textarea
                    value={modalNotes}
                    onChange={(e) => setModalNotes(e.target.value)}
                    rows={2}
                    placeholder="Internal fulfillment notes or courier consignment reference..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E4E0] bg-white focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 border-t border-[#E6E4E0] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={closeOrderModal}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl border border-[#E6E4E0] text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveOperationalUpdates}
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Operational Changes</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

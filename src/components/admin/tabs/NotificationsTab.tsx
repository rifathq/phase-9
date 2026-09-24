'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { 
  Bell, 
  CheckCheck, 
  ShoppingBag, 
  Banknote, 
  CreditCard, 
  Store, 
  Info,
  Clock
} from 'lucide-react';

export function NotificationsTab() {
  const { notifications, isLoadingNotifications, markNotificationRead } = useAdmin();
  const [filterUnread, setFilterUnread] = useState(false);

  const displayedNotifications = filterUnread 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white border border-[#E6E4E0] rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#111111]">Platform Notifications &amp; Alerts</h2>
            <p className="text-xs text-neutral-500">
              System alerts for incoming customer orders, withdrawal requests, and paid subscription upgrades.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterUnread(!filterUnread)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                filterUnread 
                  ? 'bg-neutral-900 text-white border-neutral-900' 
                  : 'bg-[#F7F6F3] text-neutral-700 border-[#E6E4E0] hover:bg-[#EAE8E2]'
              }`}
            >
              {filterUnread ? 'Showing Unread' : 'Show All'}
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-[#E6E4E0] rounded-2xl shadow-xs overflow-hidden">
        {isLoadingNotifications ? (
          <div className="py-16 text-center text-xs text-neutral-500">
            Loading notifications from Firestore...
          </div>
        ) : displayedNotifications.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Bell className="w-8 h-8 text-neutral-300 mx-auto" />
            <p className="text-xs font-semibold text-neutral-700">No notifications to display</p>
            <p className="text-[11px] text-neutral-500 max-w-sm mx-auto">
              You are all caught up. New operational events will generate alert items here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {displayedNotifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                  notif.isRead ? 'bg-white' : 'bg-[#FAF9F5]'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    notif.type === 'order' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    notif.type === 'withdrawal' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    notif.type === 'subscription' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    'bg-neutral-100 text-neutral-700 border border-neutral-200'
                  }`}>
                    {notif.type === 'order' && <ShoppingBag className="w-4 h-4" />}
                    {notif.type === 'withdrawal' && <Banknote className="w-4 h-4" />}
                    {notif.type === 'subscription' && <CreditCard className="w-4 h-4" />}
                    {notif.type !== 'order' && notif.type !== 'withdrawal' && notif.type !== 'subscription' && (
                      <Info className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-neutral-900 text-xs sm:text-sm">
                        {notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-2 font-medium">
                      <Clock className="w-3 h-3" />
                      <span>{notif.createdAt ? new Date(notif.createdAt).toLocaleString() : 'Recent'}</span>
                    </div>
                  </div>
                </div>

                {!notif.isRead && (
                  <button
                    onClick={() => markNotificationRead(notif.id)}
                    className="shrink-0 text-xs font-semibold text-neutral-500 hover:text-black transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark read</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

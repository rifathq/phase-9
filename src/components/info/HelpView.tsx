'use client';

import React, { useState } from 'react';
import { HelpCircle, Phone, Mail, MessageCircle, ChevronDown, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export function HelpView() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Cash on Delivery (COD) work on Zero Invest?',
      a: 'You can place orders with Cash on Delivery across all 64 districts of Bangladesh. You only pay when the delivery courier delivers the parcel to your doorstep and allows you to inspect the external packaging.',
    },
    {
      q: 'How can I start reselling products with zero initial capital?',
      a: 'Click "Start Selling" or register as a Reseller. You get immediate access to our verified supplier catalog with wholesale BDT pricing. You can set your own retail markup, share your custom store or product landing pages, and we handle stock fulfillment and delivery. Your net margin is credited directly to your digital wallet.',
    },
    {
      q: 'Which payment methods are supported for instant settlement?',
      a: 'We support bKash, Nagad, Rocket, local Visa/Mastercard debit cards, and Bank Wire transfer for customer checkout and reseller earnings withdrawals.',
    },
    {
      q: 'What is the standard return and replacement policy?',
      a: 'If a customer receives a damaged, defective, or incorrect product, they can initiate a replacement claim within 7 calendar days of delivery with parcel unboxing proof.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
          Help &amp; Support Center
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
          Need assistance with orders, courier tracking, payments, or reseller onboarding? We are here to help.
        </p>
      </div>

      {/* Direct Contact Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 text-center space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <MessageCircle className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold text-neutral-900">WhatsApp Support</h3>
          <p className="text-[11px] text-neutral-500">Live chat daily 9 AM - 11 PM</p>
          <p className="text-xs font-bold text-neutral-900">+880 1700-000000</p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-5 text-center space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold text-neutral-900">Customer Helpline</h3>
          <p className="text-[11px] text-neutral-500">Sunday - Thursday</p>
          <p className="text-xs font-bold text-neutral-900">09600-000000</p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-5 text-center space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold text-neutral-900">Email Support</h3>
          <p className="text-[11px] text-neutral-500">Response within 24 hours</p>
          <p className="text-xs font-bold text-neutral-900">support@zeroinvest.bd</p>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-900">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs cursor-pointer transition-colors hover:border-neutral-300"
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-bold text-neutral-900">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </div>
              {openFaq === idx && (
                <p className="text-xs text-neutral-600 mt-3 pt-3 border-t border-neutral-100 leading-relaxed">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

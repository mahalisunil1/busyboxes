'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  X,
  ShieldCheck,
  Zap,
  Clock,
  RotateCcw,
  CheckCircle2,
  Lock,
  Loader2,
} from 'lucide-react';

export const OrderGigModal: React.FC = () => {
  const {
    isOrderModalOpen,
    setIsOrderModalOpen,
    orderingGig,
    selectedTier,
    placeOrder,
  } = useApp();

  const [notes, setNotes] = useState(
    'Please proceed with the deliverables as outlined in the package.'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOrderModalOpen || !orderingGig) return null;

  const pkg = orderingGig.packages[selectedTier];

  const handleConfirmOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      placeOrder(orderingGig, selectedTier, notes);
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsOrderModalOpen(false);
      }, 1800);
    }, 1000);
  };

  return (
    <div
      onClick={() => setIsOrderModalOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/50 backdrop-blur-xs"
    >
      <div
        className="relative w-full max-w-lg rounded-xl bg-white border border-slate-200 shadow-xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">Order Service Checkout</h2>
          </div>
          <button
            onClick={() => setIsOrderModalOpen(false)}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {isSuccess ? (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Order Confirmed!</h3>
              <p className="text-xs text-slate-600 max-w-sm">
                Your order for <strong className="text-slate-800">{pkg.name}</strong> has been created. The specialist will start working immediately.
              </p>
            </div>
          ) : (
            <>
              {/* Summary */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={orderingGig.thumbnail}
                  alt={orderingGig.title}
                  className="w-14 h-14 rounded-md object-cover shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-[#0a66c2]">
                    {selectedTier} Package
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {orderingGig.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                    <span>{pkg.deliveryDays} Days Delivery</span>
                    <span>•</span>
                    <span>{pkg.revisions}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Instructions / Requirements
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#0a66c2]"
                />
              </div>

              {/* Price Breakdown */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Package Base Price</span>
                  <span className="font-semibold text-slate-900">${pkg.price}.00</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Escrow Protection Fee</span>
                  <span className="text-emerald-700 font-semibold">$0.00 (Waived)</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                  <span>Total Amount</span>
                  <span className="text-[#0a66c2]">${pkg.price}.00 USD</span>
                </div>
              </div>

              {/* Escrow badge */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Protected by Escrow. Payment is released only after you approve delivery.</span>
              </div>

              {/* Submit */}
              <button
                onClick={handleConfirmOrder}
                disabled={isProcessing}
                className="w-full py-2.5 rounded-lg font-bold text-xs sm:text-sm text-white bg-[#0a66c2] hover:bg-[#084e96] disabled:opacity-50 transition-colors shadow-xs"
              >
                {isProcessing ? 'Processing Order...' : `Confirm & Pay $${pkg.price}`}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

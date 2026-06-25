import React, { useState } from 'react';
import { X, HelpCircle } from 'lucide-react';

const TopUpModal = ({ isOpen, onClose }: any ) => {
  const [gateway, setGateway] = useState('');
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: any ) => {
    e.preventDefault();
    // Handle top-up logic here with API later
    console.log({ gateway, amount });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Blur Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container Container */}
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button Button */}
        <button 
          onClick={onClose}
          className="absolute right-5 top-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Header Typography */}
          <div>
            <h3 className="text-xl font-bold text-[#004aad] tracking-tight">
              Top up your wallet
            </h3>
            <p className="text-sm font-semibold text-slate-600 mt-2">
              Minimum Recharge Amount: <span className="font-sans">₦</span>3,000
            </p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
              Easily top up your wallet balance via a card/transfer. You can also apply any of our active coupon codes.
            </p>
          </div>

          {/* Gateway Selector Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-bold text-slate-700">
              Select payment gateway
            </label>
            <div className="relative">
              <select
                value={gateway}
                onChange={(e) => setGateway(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-600 appearance-none focus:outline-none focus:border-[#004aad] focus:ring-1 focus:ring-[#004aad] transition-all cursor-pointer"
                required
              >
                <option value="" disabled hidden>Select payment method</option>
                <option value="paystack">Paystack (Card, Transfer, USSD)</option>
                <option value="flutterwave">Flutterwave (Card, Bank Transfer)</option>
              </select>
              {/* Custom styled select caret dropdown icon */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 border-l border-slate-100 pl-2">
                <span className="text-[10px]">▼</span>
              </div>
            </div>
          </div>

          {/* Input Amount Field */}
          <div className="relative space-y-1.5">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 select-none">
                ₦
              </span>
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="3000"
                className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#004aad] focus:ring-1 focus:ring-[#004aad] transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                required
              />
            </div>
          </div>

          {/* Total Gray Calculator Block Row */}
          <div className="bg-slate-50 border border-slate-100/80 rounded-xl p-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <HelpCircle size={16} className="text-emerald-600 shrink-0" />
            <span className="text-slate-500">Total:</span>
            <span>₦{amount ? Number(amount).toLocaleString() : '0'}</span>
          </div>

          {/* Notice Banner */}
          <div className="space-y-0.5">
            <h5 className="text-xs sm:text-sm font-bold text-[#004aad]">Notice:</h5>
            <p className="text-xs text-slate-500 font-medium">
              Your account will be credited in your local currency
            </p>
          </div>

          {/* Submit Action Action */}
          <button
            type="submit"
            className="w-full bg-slate-400 hover:bg-[#004aad] text-white font-bold text-sm py-3 px-4 rounded-full transition-all tracking-wide shadow-sm transform active:scale-[0.99] cursor-pointer"
          >
            Top up wallet
          </button>

        </form>
      </div>
    </div>
  );
};

export default TopUpModal;
import  { useState } from 'react';
import { Wallet as WalletIcon, Plus, CreditCard, Settings, Bell, ArrowUpRight } from 'lucide-react';
import TopUpModal from '../../components/dashboard/main/TopUpModal';

const Wallet = () => {
  // State control for opening/closing the modal safely
  const [isModalOpen, setIsModalOpen] = useState(false);
  const balance = "10";

  return (
    <div className="w-full max-w-5xl mx-auto p-6 font-sans">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            abdubasit's Wallet
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mt-1 leading-relaxed">
            Manage your funds effortlessly. Top-up using card deposits, bank routing transfers, or control smart automated balance notifications.
          </p>
        </div>

        <button className="inline-flex items-center self-start md:self-center gap-2 px-3 py-1.5 border border-slate-200 hover:border-slate-300 rounded-xl bg-white shadow-sm text-xs font-medium text-slate-600 transition-all">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Low Balance Settings</span>
          <Settings className="w-3.5 h-3.5 text-slate-400 ml-1" />
        </button>
      </div>

      {/* 2. Primary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Card: Account & Funds Container */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <WalletIcon className="w-4 h-4 text-[#004aad]" />
              <span>Available Balance</span>
            </div>
            
            <div className="flex items-baseline gap-1 mt-1 text-slate-900">
              <span className="text-2xl font-bold select-none text-slate-700">₦</span>
              <span className="text-4xl font-extrabold tracking-tight">{balance}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            {/* UPDATED: Added onClick to toggle open state */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#004aad] hover:bg-[#0e5bbe] text-white font-medium text-sm rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Top-up Wallet</span>
            </button>
            
            <button className="flex items-center justify-center gap-1.5 px-3 py-3 border border-dashed border-[#004aad] hover:border-[#4894f8] text-[#004aad] hover:text-[#002b64] bg-slate-50/50 hover:bg-indigo-50/20 font-medium text-xs rounded-xl text-center transition-all cursor-pointer">
              <Plus className="w-3.5 h-3.5" />
              <span>Dedicated Account</span>
            </button>
          </div>
        </div>

        {/* Right Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col min-h-[220px]">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <CreditCard className="w-4 h-4 text-slate-500" />
            <span>Auto Recharge</span>
          </div>

          <div className="flex-1 border border-dashed border-slate-200 rounded-xl bg-slate-50/40 hover:bg-slate-50 flex flex-col items-center justify-center p-4 transition-colors group cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-slate-600 group-hover:border-slate-300 shadow-sm mb-2 transition-all">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-slate-500 group-hover:text-slate-700 transition-colors">
              Add a debit card
            </span>
          </div>
        </div>

      </div>

      {/* RENDER THE MODAL AT THE BASE ROOT */}
      <TopUpModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

    </div>
  );
};

export default Wallet;
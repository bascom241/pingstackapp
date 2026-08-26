import { Wallet, ArrowRight, LineChart, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBalance } from "../../../features/wallet/hooks/useBalance";
const WelcomeMessageSection = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useBalance();
  console.log("balance:", data);
  console.log("loading:", isLoading);
  console.log("error:", error);
  return (
    <div className="flex flex-col gap-4 w-full bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      {/* 1. Header Row */}
      <div className="flex gap-2 items-center text-gray-500">
        <Wallet size={16} className="text-[#004aad] shrink-0" />
        <p className="text-sm sm:text-base font-medium">Hi Edulink, Welcome to your dashboard</p>
      </div>

      {/* 2. Balance & Action Row (Stacks vertically on small phones, side-by-side on larger screens) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100 sm:bg-transparent sm:p-0 sm:border-none">
        <div className="flex items-baseline gap-1 text-slate-900">

          {
            isLoading ? <Loader2 className="animate-spin" /> : <><span className="text-xl font-bold text-slate-700 select-none">₦</span> <span className="text-4xl font-extrabold tracking-tight">{data}</span></>
          }

        </div>

        <button onClick={() => navigate("/dashboard/billing")} className="w-full sm:w-fit bg-[#004aad] hover:bg-blue-700 text-white font-semibold text-sm py-2.5 px-4 rounded-xl sm:rounded-full transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2 group cursor-pointer">
          <Wallet size={16} className="shrink-0" />
          <span>Fund wallet</span>
          <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform shrink-0" />
        </button>
      </div>

      {/* 3. Subtext / Indicator Row */}
      <div className="flex gap-2 items-center mt-2 text-slate-500 bg-slate-50 p-3 rounded-xl sm:bg-transparent sm:p-0 border border-slate-100 sm:border-none">
        <LineChart size={18} className="text-[#004aad] shrink-0" />
        <p className="text-xs sm:text-sm font-medium">All channels performance</p>
      </div>
    </div>
  );
};

export default WelcomeMessageSection;
import { InlineSkeleton } from "../../../ui/Skeleton";
import { Link } from "react-router-dom";
import { Wallet, Plus, ArrowUpRight, ShieldCheck } from "../../../ui/icons";
import { useBalance } from "../../../features/wallet/hooks/useBalance";
import { formatNaira } from "../../../utils/currency";

export default function WelcomeMessageSection() {
  const { data, isPending, isError, refetch } = useBalance();
  return (
    <div className="dashboard-card overview-wallet">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5"><span className="text-[#004aad]"><Wallet size={21} /></span><h2 className="dashboard-card-title">Your wallet</h2></div>
        <Link to="/dashboard/billing" className="dashboard-text-link">View wallet <ArrowUpRight size={16} /></Link>
      </div>
      <p className="dashboard-card-description mb-2!">Available balance</p>
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div className="overview-wallet-amount" aria-live="polite">
          {isPending ? <InlineSkeleton width={190} height={46} label="Loading wallet balance" /> : isError ? <span className="text-lg text-slate-500">Balance unavailable</span> : <><span className="text-slate-400 font-normal mr-1">₦</span>{formatNaira(data)}</>}
        </div>
        <Link to="/dashboard/billing" className="dashboard-button dashboard-button-primary"><Plus size={18} />Fund wallet</Link>
      </div>
      <div className="overview-wallet-footer">
        {isError ? <button onClick={() => void refetch()} className="dashboard-text-link">Try loading your balance again</button> : <><ShieldCheck size={16} /><span>One wallet for your messaging needs.</span></>}
      </div>
    </div>
  );
}

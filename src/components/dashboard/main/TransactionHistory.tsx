import { DataSkeleton } from "../../../ui/Skeleton";
import { useState } from "react";
import { Link } from "react-router-dom";
import { History, ArrowUpRight, ChevronLeft, ChevronRight, Copy } from "../../../ui/icons";
import { useAllHistory } from "../../../features/wallet/hooks/useTransaction";

type Transaction = { orderId: string; transactionNumber?: string; paymentMethod?: string; createdAt: string };
function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function TransactionHistory() {
  const [page, setPage] = useState(0);
  const [notice, setNotice] = useState("");
  const { data, isPending, isError, isFetching, refetch } = useAllHistory(page, 5);
  const transactions: Transaction[] = data?.content ?? [];
  const totalPages = Math.max(1, data?.totalPages ?? 1);
  async function copyReference(reference: string) {
    try { await navigator.clipboard.writeText(reference); setNotice("Reference copied."); }
    catch { setNotice("Could not copy the reference. Please select and copy it manually."); }
  }
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-heading flex-wrap">
        <div><h2 className="dashboard-card-title">Recent transactions</h2><p className="dashboard-card-description">Your latest wallet activity, at a glance.</p></div>
        <Link to="/dashboard/billing" className="dashboard-text-link">View all <ArrowUpRight size={16} /></Link>
      </div>
      {isPending ? <DataSkeleton layout="table" rows={5} label="Loading transactions" />
        : isError ? <div className="dashboard-empty" role="status"><strong>Transactions could not be loaded</strong><span>Please try again in a moment.</span><button className="dashboard-button" onClick={() => void refetch()}>Try again</button></div>
        : transactions.length === 0 ? <div className="dashboard-empty"><span className="dashboard-empty-icon"><History size={23} /></span><strong>No transactions yet</strong><span>Your wallet activity will appear here after your first transaction.</span><Link to="/dashboard/billing" className="dashboard-text-link mt-2">Go to wallet <ArrowUpRight size={16} /></Link></div>
        : <>
          <div className="overflow-x-auto" aria-busy={isFetching}>
            <table className="overview-transactions"><caption className="sr-only">Recent wallet transactions</caption><thead><tr><th scope="col">Reference</th><th scope="col">Payment method</th><th scope="col" className="text-right">Date</th></tr></thead>
              <tbody>{transactions.map(tx => <tr key={tx.orderId}>
                <td><button className="inline-flex items-center gap-2 text-slate-600 hover:text-[#004aad] font-mono text-xs" title={tx.transactionNumber} aria-label={`Copy reference ${tx.transactionNumber ?? "unavailable"}`} disabled={!tx.transactionNumber} onClick={() => tx.transactionNumber && void copyReference(tx.transactionNumber)}>{tx.transactionNumber?.slice(0, 15) ?? "—"}{tx.transactionNumber && <Copy size={14} />}</button></td>
                <td><span className="inline-flex rounded-md bg-blue-50 px-2 py-1 text-xs text-[#004aad] capitalize">{tx.paymentMethod ?? "—"}</span></td>
                <td className="text-right text-slate-500 text-xs"><time dateTime={tx.createdAt}>{formatDate(tx.createdAt)}</time></td>
              </tr>)}</tbody>
            </table>
          </div>
          {totalPages > 1 && <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4 mt-3"><span className="text-xs text-slate-500">Page {page + 1} of {totalPages}</span><div className="flex gap-2"><button className="dashboard-icon-button border! border-slate-200! disabled:opacity-40" aria-label="Previous transactions page" disabled={page === 0 || isFetching} onClick={() => setPage(previous => Math.max(0, previous - 1))}><ChevronLeft size={18} /></button><button className="dashboard-icon-button border! border-slate-200! disabled:opacity-40" aria-label="Next transactions page" disabled={page >= totalPages - 1 || isFetching} onClick={() => setPage(previous => previous + 1)}><ChevronRight size={18} /></button></div></div>}
          <p role="status" className="text-xs text-slate-500 mt-2">{notice}</p>
        </>}
    </div>
  );
}

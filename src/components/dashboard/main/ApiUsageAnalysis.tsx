import { DataSkeleton } from "../../../ui/Skeleton";
import { useId } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useReducedMotion } from "framer-motion";
import { LineChart } from "../../../ui/icons";
import { useOrderChat } from "../../../features/wallet/hooks/useChart";

function formatDate(value: unknown): string {
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? String(value ?? "") : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function AnalyticsChart({ title = "Transaction activity" }: { title?: string }) {
  const { data, isPending, isError, refetch } = useOrderChat();
  const reducedMotion = useReducedMotion();
  const gradientId = useId().replace(/:/g, "");
  const points: { timestamp: string; value: number }[] = Array.isArray(data) ? data.filter((point: unknown): point is { timestamp: string; value: number } => {
    if (!point || typeof point !== "object") return false;
    const record = point as Record<string, unknown>;
    return typeof record.timestamp === "string" && typeof record.value === "number" && Number.isFinite(record.value);
  }) : [];
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-heading">
        <div><h2 className="dashboard-card-title">{title}</h2><p className="dashboard-card-description">A closer look at your wallet transactions over time.</p></div>
        <span className="rounded-xl bg-blue-50 p-2 text-[#004aad]"><LineChart size={21} /></span>
      </div>
      {isPending ? <DataSkeleton layout="chart" label="Loading transaction activity" />
        : isError ? <div className="dashboard-empty h-64" role="status"><strong>Activity could not be loaded</strong><span>Try again to see your latest transactions.</span><button className="dashboard-button" onClick={() => void refetch()}>Try again</button></div>
        : points.length === 0 ? <div className="dashboard-empty h-64"><span className="dashboard-empty-icon"><LineChart size={24} /></span><strong>Your activity starts here</strong><span>Once you make a transaction, you will see your history over time.</span></div>
        : <div className="h-64 sm:h-72 w-full min-w-0 text-xs" role="img" aria-label={`Transaction activity chart with ${points.length} data points. Latest value: ${points[points.length - 1].value}.`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ top: 12, right: 12, left: -18, bottom: 8 }} accessibilityLayer>
              <defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#004aad" stopOpacity={0.16} /><stop offset="100%" stopColor="#004aad" stopOpacity={0.01} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#edf1f5" />
              <XAxis dataKey="timestamp" axisLine={false} tickLine={false} dy={10} tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={formatDate} interval="preserveStartEnd" minTickGap={35} />
              <YAxis axisLine={false} tickLine={false} allowDecimals={false} tick={{ fill: "#64748b", fontSize: 11 }} />
              <Tooltip labelFormatter={formatDate} contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 12, padding: "12px 16px" }} labelStyle={{ color: "#64748b", marginBottom: 5 }} itemStyle={{ color: "#004aad" }} />
              <Area type="monotone" dataKey="value" name="Transactions" stroke="#004aad" strokeWidth={2.5} fill={`url(#${gradientId})`} isAnimationActive={!reducedMotion} animationDuration={650} activeDot={{ r: 5, stroke: "white", strokeWidth: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>}
      <div className="flex items-center gap-2 text-xs text-slate-500 border-t border-slate-100 pt-4 mt-5"><span className="w-2 h-2 rounded-full bg-[#004aad]" />Wallet transactions</div>
    </div>
  );
}

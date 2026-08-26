import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { useOrderChat } from "../../../features/wallet/hooks/useChart";

// 1. Temporary Mock Data
const mockApiData = [
  { timestamp: "2026-06-01T00:00:00Z", value: 120 },
  { timestamp: "2026-06-05T00:00:00Z", value: 340 },
  { timestamp: "2026-06-10T00:00:00Z", value: 210 },
  { timestamp: "2026-06-15T00:00:00Z", value: 580 },
  { timestamp: "2026-06-20T00:00:00Z", value: 490 },
  { timestamp: "2026-06-25T00:00:00Z", value: 820 },
  { timestamp: "2026-06-30T00:00:00Z", value: 950 },
];

export default function AnalyticsChart({
 
  title = "Transaction Volume",
}) {

  const {data} = useOrderChat()
  // Helper to format API dates dynamically (e.g., '2026-06-25...' becomes 'Jun 25')
  const formatDate = (isoString: any) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm w-full mt-4 sm:mt-8">
      {/* Chart Header */}
      <div className="flex justify-between items-center mb-6 gap-2">
        <div className="min-w-0">
          <p className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Analytics
          </p>
          <h3 className="text-base sm:text-lg font-bold text-gray-800 truncate">
            {title}
          </h3>
        </div>

        {/* Metric badge */}
        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Live</span>
        </div>
      </div>

      {/* Chart Canvas Container - Fixed Heights for Mobile vs Desktop */}
      <div className="w-full h-56 sm:h-64 text-[10px] sm:text-xs font-medium text-gray-400 select-none">
        <ResponsiveContainer width="100%" height="100%">
          {/* Responsive margins: Left margin altered from -20 to -10 to prevent digit clipping on mobile */}
          <AreaChart
            data={data}
            margin={{ top: 10, right: 5, left: -10, bottom: 0 }}
          >
            <defs>
              {/* Using your Brand Color: #004aad */}
              <linearGradient id="brandGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#004aad" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#004aad" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            {/* Light horizontal grid lines */}
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />

            <XAxis
              dataKey="timestamp"
              axisLine={false}
              tickLine={false}
              dy={10}
              stroke="#94a3b8"
              tickFormatter={formatDate}
              // Automatically drops intermediate labels on smaller devices to avoid overlaps
              interval="preserveStartEnd"
              minTickGap={25}
            />

            <YAxis axisLine={false} tickLine={false} dx={5} stroke="#94a3b8" />

            {/* Custom Hover Tooltip */}
            {/* Custom Hover Tooltip */}
            <Tooltip
              labelFormatter={formatDate}
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #f1f5f9",
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                fontSize: "12px",
              }}
              labelStyle={{
                fontWeight: "600",
                color: "#1e293b",
                marginBottom: "4px",
              }}
              // FIXED: Changed paddingVertical to standard web styles
              itemStyle={{
                color: "#004aad",
                fontWeight: "500",
                paddingTop: "2px",
                paddingBottom: "2px",
              }}
            />

            {/* Interactive Data Area */}
            <Area
              type="monotone"
              dataKey="value"
              name="Transactions"
              stroke="#004aad"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#brandGradient)"
              activeDot={{
                r: 5,
                stroke: "#ffffff",
                strokeWidth: 2,
                fill: "#004aad",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

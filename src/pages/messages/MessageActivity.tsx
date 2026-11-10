import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Link } from "react-router-dom";
import { getMessages, messageAction } from "../../features/messaging/api/messageService";
import { getApiErrorMessage } from "../../utils/apiError";
import { axiosInstance } from "../../api/axios";
import "../../components/messaging/messaging.css";
import "../../components/messaging/operations.css";

export default function MessageActivity() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [feedback, setFeedback] = useState("");
  const cache = useQueryClient();
  const messages = useQuery({ queryKey: ["message-jobs", page, search, status], queryFn: () => getMessages(page, search, status), refetchInterval: 5000 });
  const stats = useQuery({ queryKey: ["message-stats"], queryFn: async () => (await axiosInstance.get<Record<string, number>>("/messages/stats")).data, refetchInterval: 5000 });
  const action = useMutation({
    mutationFn: ({ id, action }: { id: string; action: "pause" | "resume" | "cancel" | "retry" }) => messageAction(id, action),
    onSuccess: () => { cache.invalidateQueries({ queryKey: ["message-jobs"] }); cache.invalidateQueries({ queryKey: ["balance"] }); setFeedback("Message updated."); },
    onError: error => setFeedback(getApiErrorMessage(error)),
  });
  const counts = stats.data ?? {};
  const total = Object.values(counts).reduce((sum, value) => sum + value, 0);
  const waiting = (counts.QUEUED ?? 0) + (counts.PAUSED ?? 0) + (counts.SENDING ?? 0);
  const attention = (counts.FAILED ?? 0) + (counts.UNKNOWN ?? 0) + (counts.BOUNCED ?? 0);
  const chart = Object.entries(counts).filter(([, count]) => count > 0).map(([state, count]) => ({ state: state.charAt(0) + state.slice(1).toLowerCase(), count, color: ["FAILED", "BOUNCED", "UNKNOWN"].includes(state) ? "#b45309" : state === "DELIVERED" ? "#15803d" : "#004aad" }));
  return <div className="messaging-page operations-page space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-3xl font-bold">Message activity</h1><p className="mt-2 text-slate-500">Delivery status and scheduled messages from your automations.</p></div><Link to="/dashboard/automations" className="operations-button operations-button-primary">Create automation</Link></div>
    <p role="status">{feedback}</p>
    {stats.isError && <p role="alert">Delivery summary is unavailable. You can still review individual messages below.</p>}
    <div className="operations-metrics" aria-label="Delivery overview">{[
      ["Total messages", total, "Across all automations"], ["Delivered", counts.DELIVERED ?? 0, "Confirmed by delivery receipts"], ["In progress", waiting, "Queued, paused or sending"], ["Needs attention", attention, "Failed, bounced or unconfirmed"],
    ].map(([label, value, note]) => <section className="operations-metric" key={label}><span>{label}</span><strong>{stats.isPending || stats.isError ? "--" : value}</strong><small>{note}</small></section>)}</div>
    <section className="operations-card"><div className="operations-section-heading"><div><h2>Delivery overview</h2><p>All messages by their current status. Sent means accepted; delivered means receipt confirmed.</p></div><span className="operations-tag">All time</span></div>
      {stats.isPending ? <div className="operations-empty">Loading delivery summary...</div> : stats.isError ? <div className="operations-empty">Summary unavailable</div> : chart.length === 0 ? <div className="operations-empty">Your delivery breakdown will appear when your first automation runs.</div> : <div className="operations-chart" role="img" aria-label={chart.map(item => `${item.state}: ${item.count}`).join(", ")}><ResponsiveContainer width="100%" height="100%"><BarChart data={chart} margin={{ top: 15, right: 12, left: 0, bottom: 12 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/><XAxis dataKey="state" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false}/><YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={42}/><Tooltip cursor={{ fill: "#edf4ff" }} contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }}/><Bar dataKey="count" name="Messages" maxBarSize={52} radius={[5, 5, 0, 0]}>{chart.map(item => <Cell key={item.state} fill={item.color}/>)}</Bar></BarChart></ResponsiveContainer></div>}
    </section>
    <div className="operations-section-heading"><div><h2>Message log</h2><p>Search deliveries and manage messages that are still queued.</p></div><span className="operations-tag">Updates every 5 seconds</span></div>
    <div className="flex flex-wrap gap-4"><label className="flex-1 text-sm font-semibold">Search messages<input value={search} onChange={event => { setSearch(event.target.value); setPage(0); }} placeholder="Recipient, subject, or delivery reference" className="mt-2 block w-full rounded-xl border border-slate-200 p-3" /></label><label className="text-sm font-semibold">Status<select value={status} onChange={event => { setStatus(event.target.value); setPage(0); }} className="mt-2 block rounded-xl border border-slate-200 p-3"><option value="">All statuses</option>{["QUEUED", "PAUSED", "SENDING", "SENT", "DELIVERED", "FAILED", "UNKNOWN", "SUPPRESSED", "BOUNCED", "CANCELLED"].map(state => <option key={state}>{state}</option>)}</select></label></div>
    {messages.isPending && <p>Loading messages…</p>}
    {messages.isError && <p role="alert">{getApiErrorMessage(messages.error, "Could not load messages.")}</p>}
    {messages.data && <section className="operations-card operations-table-wrap">
      {!messages.data.content.length ? <p>No messages yet. Create an automation to see its progress here.</p> : <table className="w-full text-left text-sm"><thead><tr className="border-b"><th className="p-3">Recipient</th><th className="p-3">Channel</th><th className="p-3">Status</th><th className="p-3">Send time</th><th className="p-3">Actions</th></tr></thead><tbody>{messages.data.content.map(job => <tr key={job.id} className="border-b align-top">
        <td className="p-3">{job.recipient}{job.subject && <p className="text-slate-500">{job.subject}</p>}</td>
        <td className="p-3">{job.channel === "SMS" ? "SMS" : "Email"}</td><td className="p-3"><span className={`operations-status status-${job.status.toLowerCase()}`}>{job.status.toLowerCase().replaceAll("_", " ")}</span>{job.lastError && <p className="max-w-xs text-red-700 mt-1">{job.lastError.replace(/brevo|gmail|google|termii/gi, "delivery service")}</p>}{job.status === "UNKNOWN" && <p className="max-w-xs mt-1">Delivery needs review. Contact support before sending again.</p>}</td>
        <td className="p-3 whitespace-nowrap">{new Date(job.scheduledAt).toLocaleString()}</td>
        <td className="p-3"><div className="flex gap-3">{(["QUEUED", "PAUSED"].includes(job.status) ? [job.status === "QUEUED" ? "pause" : "resume", "cancel"] : job.status === "FAILED" && job.attempts < job.maxAttempts ? ["retry"] : []).map(value => <button key={value} className="text-blue-700 underline capitalize" disabled={action.isPending} onClick={() => action.mutate({ id: job.id, action: value as "pause" | "resume" | "cancel" | "retry" })}>{value}</button>)}</div></td>
      </tr>)}</tbody></table>}
      <div className="mt-5 flex items-center justify-end gap-4"><button disabled={page === 0} onClick={() => setPage(value => value - 1)}>Previous</button><span>Page {page + 1}</span><button disabled={page + 1 >= messages.data.totalPages} onClick={() => setPage(value => value + 1)}>Next</button></div>
    </section>}
  </div>;
}


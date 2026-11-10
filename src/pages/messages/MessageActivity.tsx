import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getMessages, messageAction } from "../../features/messaging/api/messageService";
import { getApiErrorMessage } from "../../utils/apiError";
import { axiosInstance } from "../../api/axios";
import "../../components/messaging/messaging.css";

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
  return <div className="messaging-page space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-3xl font-bold">Message activity</h1><p className="mt-2 text-slate-500">Delivery status and scheduled messages from your automations.</p></div><Link to="/dashboard/automations" className="messaging-primary">Create automation</Link></div>
    <p role="status">{feedback}</p>
    {stats.data && <div className="flex flex-wrap gap-3">{Object.entries(stats.data).map(([state, count]) => <span key={state} className={`rounded-xl border px-4 py-3 text-sm ${["FAILED", "UNKNOWN"].includes(state) ? "border-red-200 text-red-700" : "border-slate-200"}`}>{state}: <strong>{count}</strong></span>)}</div>}
    <div className="flex flex-wrap gap-4"><label className="flex-1 text-sm font-semibold">Search messages<input value={search} onChange={event => { setSearch(event.target.value); setPage(0); }} placeholder="Recipient, subject, or delivery reference" className="mt-2 block w-full rounded-xl border border-slate-200 p-3" /></label><label className="text-sm font-semibold">Status<select value={status} onChange={event => { setStatus(event.target.value); setPage(0); }} className="mt-2 block rounded-xl border border-slate-200 p-3"><option value="">All statuses</option>{["QUEUED", "PAUSED", "SENDING", "SENT", "DELIVERED", "FAILED", "UNKNOWN", "SUPPRESSED", "BOUNCED", "CANCELLED"].map(state => <option key={state}>{state}</option>)}</select></label></div>
    {messages.isPending && <p>Loading messages…</p>}
    {messages.isError && <p role="alert">{getApiErrorMessage(messages.error, "Could not load messages.")}</p>}
    {messages.data && <section className="messaging-panel overflow-x-auto">
      {!messages.data.content.length ? <p>No messages yet. Create an automation to see its progress here.</p> : <table className="w-full text-left text-sm"><thead><tr className="border-b"><th className="p-3">Recipient</th><th className="p-3">Channel</th><th className="p-3">Status</th><th className="p-3">Send time</th><th className="p-3">Actions</th></tr></thead><tbody>{messages.data.content.map(job => <tr key={job.id} className="border-b align-top">
        <td className="p-3">{job.recipient}{job.subject && <p className="text-slate-500">{job.subject}</p>}</td>
        <td className="p-3">{job.channel === "SMS" ? "SMS" : "Email"}</td><td className="p-3"><strong>{job.status}</strong>{job.lastError && <p className="max-w-xs text-red-700 mt-1">{job.lastError.replace(/brevo|gmail|google|termii/gi, "delivery service")}</p>}{job.status === "UNKNOWN" && <p className="max-w-xs mt-1">Delivery needs review. Contact support before sending again.</p>}</td>
        <td className="p-3 whitespace-nowrap">{new Date(job.scheduledAt).toLocaleString()}</td>
        <td className="p-3"><div className="flex gap-3">{(["QUEUED", "PAUSED"].includes(job.status) ? [job.status === "QUEUED" ? "pause" : "resume", "cancel"] : job.status === "FAILED" && job.attempts < job.maxAttempts ? ["retry"] : []).map(value => <button key={value} className="text-blue-700 underline capitalize" disabled={action.isPending} onClick={() => action.mutate({ id: job.id, action: value as "pause" | "resume" | "cancel" | "retry" })}>{value}</button>)}</div></td>
      </tr>)}</tbody></table>}
      <div className="mt-5 flex items-center justify-end gap-4"><button disabled={page === 0} onClick={() => setPage(value => value - 1)}>Previous</button><span>Page {page + 1}</span><button disabled={page + 1 >= messages.data.totalPages} onClick={() => setPage(value => value + 1)}>Next</button></div>
    </section>}
  </div>;
}


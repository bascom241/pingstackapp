import { useState, type FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createAutomation, getAutomations, setAutomationEnabled } from "../../features/automations/api/automationService";
import type { AutomationStep as Step } from "../../features/automations/types/automation";
import { getApiErrorMessage } from "../../utils/apiError";
import "../../components/messaging/messaging.css";
import "../../components/messaging/operations.css";

const newStep = (): Step => ({ channel: "EMAIL", recipient: "", sender: "", subject: "", body: "", delaySeconds: 0, transactional: false, condition: "ALWAYS" });
const inputClass = "mt-1 block w-full rounded-xl border border-slate-200 bg-white p-3 text-sm";
export default function Automations() {
  const cache = useQueryClient();
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState("now");
  const [eventName, setEventName] = useState("");
  const [nextRunAt, setNextRunAt] = useState("");
  const [repeatMinutes, setRepeatMinutes] = useState(0);
  const [steps, setSteps] = useState<Step[]>([newStep()]);
  const [feedback, setFeedback] = useState("");
  const list = useQuery({ queryKey: ["automations"], queryFn: getAutomations, refetchInterval: 15000 });
  const create = useMutation({
    mutationFn: async () => createAutomation({ name, eventName: trigger === "event" ? eventName : undefined,
      nextRunAt: trigger === "now" ? new Date().toISOString() : trigger === "schedule" ? new Date(nextRunAt).toISOString() : undefined, repeatSeconds: trigger === "schedule" && repeatMinutes > 0 ? repeatMinutes * 60 : undefined,
      steps: steps.map(step => ({ ...step, sender: step.sender || undefined })) }),
    onSuccess: () => { setFeedback("Automation created. Scheduled runs and matching events will queue its messages."); setName(""); setSteps([newStep()]); cache.invalidateQueries({ queryKey: ["automations"] }); },
    onError: error => setFeedback(getApiErrorMessage(error)),
  });
  const action = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) => setAutomationEnabled(id, !enabled),
    onSuccess: () => cache.invalidateQueries({ queryKey: ["automations"] }), onError: error => setFeedback(getApiErrorMessage(error)),
  });
  const update = (index: number, value: Partial<Step>) => setSteps(current => current.map((step, position) => position === index ? { ...step, ...value } : step));
  const submit = (event: FormEvent) => { event.preventDefault(); if (trigger === "schedule" && new Date(nextRunAt).getTime() <= Date.now()) { setFeedback("Choose a future start time."); return; } create.mutate(); };
  return <div className="messaging-page operations-page space-y-6">
    <div><h1 className="text-3xl font-bold">Automations</h1><p className="mt-2 text-slate-500">Send now, schedule messages, or build event sequences from one place.</p></div>
    <div className="operations-metrics">{[["Total automations", list.data?.length], ["Active", list.data?.filter(item => item.enabled).length], ["Needs attention", list.data?.filter(item => item.lastError).length], ["Message steps", list.data?.reduce((sum, item) => sum + item.steps.length, 0)]].map(([label, value]) => <section className="operations-metric" key={label}><span>{label}</span><strong>{value ?? "--"}</strong><small>Current automation library</small></section>)}</div>
    <section className="messaging-panel space-y-4"><div className="operations-section-heading"><div><h2>Your automations</h2><p>Manage active sequences and review the next scheduled run.</p></div><a className="operations-button" href="#automation-builder">New automation</a></div>{list.isError && <p role="alert">{getApiErrorMessage(list.error)}</p>}{list.isPending && <p>Loading…</p>}{list.data?.length === 0 && <p>No automations yet.</p>}{list.data?.map(item => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 border-b py-3"><div><strong>{item.name}</strong><p className="text-sm text-slate-500">{item.lastError ? "Needs attention" : item.enabled ? "Active" : !item.nextRunAt && !item.eventName ? "Completed" : "Paused"} · {item.steps.length} steps · {item.eventName || (item.nextRunAt ? new Date(item.nextRunAt).toLocaleString() : "Finished")}</p>{item.lastError && <p className="mt-1 text-sm text-red-700">{item.lastError}</p>}</div><button className="operations-button" disabled={action.isPending || (!item.enabled && !item.nextRunAt && !item.eventName)} onClick={() => action.mutate({ id: item.id, enabled: item.enabled })}>{item.enabled ? "Pause" : "Resume"}</button></div>)}</section>
    <div id="automation-builder" className="operations-section-heading"><div><h2>Create automation</h2><p>Choose a trigger, compose your messages, and build your sequence.</p></div><span className="operations-tag">{steps.length} / 20 steps</span></div>
    <form onSubmit={submit} className="operations-builder space-y-6">
      <section className="messaging-panel grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">Name<input required maxLength={200} value={name} onChange={event => setName(event.target.value)} className={inputClass} /></label>
        <label className="text-sm font-semibold">Start when<select value={trigger} onChange={event => setTrigger(event.target.value)} className={inputClass}><option value="now">Run once now</option><option value="schedule">At a scheduled time</option><option value="event">When an event occurs</option></select></label>
        {trigger === "event" ? <label className="text-sm font-semibold sm:col-span-2">Event name<input required maxLength={100} value={eventName} onChange={event => setEventName(event.target.value)} placeholder="user.created" className={inputClass} /><span className="mt-2 block font-normal text-slate-500">Your application triggers this sequence by posting the event and its data to /events. Use variables such as {"{{name}}"} or {"{{email}}"} in steps.</span></label> : trigger === "schedule" ? <><label className="text-sm font-semibold">Start time (your local time)<input type="datetime-local" required value={nextRunAt} onChange={event => setNextRunAt(event.target.value)} className={inputClass} /></label><label className="text-sm font-semibold">Repeat every (minutes; 0 runs once)<input type="number" min={0} max={525600} value={repeatMinutes} onChange={event => setRepeatMinutes(Number(event.target.value))} className={inputClass} /></label></> : <p className="sm:col-span-2 text-sm text-slate-500">This automation will run once after you create it.</p>}
      </section>
      {steps.map((step, index) => <section key={index} className="messaging-panel space-y-4">
        <div className="flex justify-between gap-4"><h2 className="font-bold"><span className="operations-step-number">{index + 1}</span>{step.channel === "EMAIL" ? "Send email" : "Send SMS"}</h2>{index > 0 && <button type="button" className="operations-button operations-danger" onClick={() => setSteps(current => current.filter((_, position) => position !== index))}>Remove</button>}</div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">Channel<select value={step.channel} onChange={event => update(index, { channel: event.target.value as Step["channel"] })} className={inputClass}><option value="EMAIL">Email</option><option value="SMS">SMS</option></select></label>
          <label className="text-sm font-semibold">Wait after previous step (seconds)<input type="number" min={0} max={31536000} required value={step.delaySeconds} onChange={event => update(index, { delaySeconds: Number(event.target.value) })} className={inputClass} /></label>
          <label className="text-sm font-semibold">Recipient<textarea required rows={2} value={step.recipient} onChange={event => update(index, { recipient: event.target.value })} placeholder={step.channel === "EMAIL" ? "Email addresses, separated by commas or new lines" : "International phone numbers, separated by commas or new lines"} className={inputClass} /></label>
          <label className="text-sm font-semibold">{step.channel === "SMS" ? "Approved sender ID" : "Sender email (optional)"}<input required={step.channel === "SMS"} value={step.sender} onChange={event => update(index, { sender: event.target.value })} className={inputClass} /></label>
          {step.channel === "EMAIL" && <label className="text-sm font-semibold">Subject<input required maxLength={998} value={step.subject} onChange={event => update(index, { subject: event.target.value })} className={inputClass} /></label>}
          {index > 0 && <label className="text-sm font-semibold">Send this step<select value={step.condition} onChange={event => update(index, { condition: event.target.value })} className={inputClass}><option value="ALWAYS">Always</option><option value="PREVIOUS_FAILED">If previous message failed</option><option value="PREVIOUS_DELIVERED">If previous message was delivered</option><option value="PREVIOUS_NOT_DELIVERED">If previous message was not delivered</option></select></label>}
        </div>
        <label className="block text-sm font-semibold">Message{step.channel === "EMAIL" ? " (HTML supported)" : ""}<textarea required value={step.body} onChange={event => update(index, { body: event.target.value })} className={inputClass} rows={4} /></label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={step.transactional} onChange={event => update(index, { transactional: event.target.checked })} />Transactional message</label>
      </section>)}
      <div className="flex flex-wrap items-center gap-4"><button type="button" className="operations-button" disabled={steps.length >= 20} onClick={() => setSteps(current => [...current, newStep()])}>Add a step</button><button className="operations-button operations-button-primary" disabled={create.isPending}>{create.isPending ? "Creating…" : "Create automation"}</button></div>
      <p role="status">{feedback}</p><p className="text-sm text-slate-500">Conditional steps match recipients in the same order. Pausing an automation stops future runs. Messages already queued can be paused or cancelled in Message activity.</p>
    </form>
  </div>;
}


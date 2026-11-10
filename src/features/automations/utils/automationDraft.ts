import type { AutomationStep, CreateAutomationRequest } from "../types/automation";

export type AutomationDraft = {
  name: string;
  trigger: "now" | "schedule" | "event";
  eventName: string;
  nextRunAt: string;
  repeatMinutes: number;
  steps: AutomationStep[];
};
export const newMessageStep = (): AutomationStep => ({ channel: "EMAIL", recipient: "", sender: "", subject: "", body: "", delaySeconds: 0, transactional: false, condition: "ALWAYS" });
export const newAutomationDraft = (): AutomationDraft => ({ name: "", trigger: "event", eventName: "", nextRunAt: "", repeatMinutes: 0, steps: [newMessageStep()] });
export function validateTrigger(draft: AutomationDraft, now = Date.now()): string {
  if (!draft.name.trim()) return "Give your automation a name.";
  if (draft.name.length > 200) return "Use a name of 200 characters or fewer.";
  if (draft.trigger === "event" && (!draft.eventName.trim() || draft.eventName.length > 100)) return "Enter an event name of 100 characters or fewer.";
  if (draft.trigger === "schedule") {
    const date = new Date(draft.nextRunAt).getTime();
    if (!Number.isFinite(date) || date <= now) return "Choose a future start time.";
    if (!Number.isInteger(draft.repeatMinutes) || draft.repeatMinutes < 0 || draft.repeatMinutes > 525600) return "Repeat interval must be a whole number between 0 and 525600 minutes.";
  }
  return "";
}
export function validateMessage(step: AutomationStep, index: number, draft: AutomationDraft): string {
  const prefix = `Message ${index + 1}: `;
  if (!step.recipient.trim()) return prefix + "add at least one recipient.";
  if (step.channel === "SMS" && !step.sender.trim()) return prefix + "enter an approved sender ID.";
  if (step.channel === "EMAIL" && (!step.subject.trim() || step.subject.length > 998)) return prefix + "enter a subject of 998 characters or fewer.";
  if (!step.body.trim()) return prefix + "write your message or choose a template.";
  if (!Number.isInteger(step.delaySeconds) || step.delaySeconds < 0 || step.delaySeconds > 31536000) return prefix + "enter a valid delay in whole seconds.";
  if (draft.trigger !== "event" && /\{\{\s*[a-zA-Z0-9_.]+\s*}}/.test([step.recipient, step.subject, step.body].join(" "))) return prefix + "replace template variables with actual values, or use an event trigger to supply them.";
  if (index > 0 && step.condition !== "ALWAYS") {
    const count = (value: string) => new Set(value.split(/[,;\r\n]+/).map(part => part.trim()).filter(Boolean)).size;
    if (count(step.recipient) !== count(draft.steps[index - 1].recipient)) return prefix + "conditional messages need the same recipient count as the previous message, in matching order.";
  }
  return "";
}
export function toAutomationRequest(draft: AutomationDraft): CreateAutomationRequest {
  return {
    name: draft.name.trim(),
    eventName: draft.trigger === "event" ? draft.eventName.trim() : undefined,
    nextRunAt: draft.trigger === "event" ? undefined : draft.trigger === "now" ? new Date().toISOString() : new Date(draft.nextRunAt).toISOString(),
    repeatSeconds: draft.trigger === "schedule" && draft.repeatMinutes > 0 ? draft.repeatMinutes * 60 : undefined,
    steps: draft.steps.map((step, index) => ({ ...step, recipient: step.recipient.trim(), sender: step.sender.trim() || undefined, condition: index === 0 ? "ALWAYS" : step.condition })),
  };
}

import type { AutomationDraft } from "../../automations/utils/automationDraft";
export function readAutomationProposal(value: unknown): AutomationDraft | null {
  if (!value || typeof value !== "object") return null;
  const draft = value as Record<string, unknown>;
  if (typeof draft.name !== "string" || draft.name.length > 200 || !["event", "schedule", "now"].includes(String(draft.trigger)) || !Array.isArray(draft.steps) || draft.steps.length < 1 || draft.steps.length > 20) return null;
  if (typeof draft.eventName !== "string" || draft.eventName.length > 100 || typeof draft.nextRunAt !== "string" || typeof draft.repeatMinutes !== "number" || !Number.isInteger(draft.repeatMinutes) || draft.repeatMinutes < 0 || draft.repeatMinutes > 525600) return null;
  const steps = [];
  for (const item of draft.steps) {
    if (!item || typeof item !== "object") return null;
    const step = item as Record<string, unknown>;
    if (!["EMAIL", "SMS"].includes(String(step.channel)) || !["ALWAYS", "PREVIOUS_FAILED", "PREVIOUS_DELIVERED", "PREVIOUS_NOT_DELIVERED"].includes(String(step.condition))) return null;
    if (typeof step.recipient !== "string" || typeof step.sender !== "string" || typeof step.subject !== "string" || step.subject.length > 998 || typeof step.body !== "string" || step.body.length > 200000 || typeof step.transactional !== "boolean" || typeof step.delaySeconds !== "number" || !Number.isInteger(step.delaySeconds) || step.delaySeconds < 0 || step.delaySeconds > 31536000) return null;
    if (step.designJson !== undefined && (typeof step.designJson !== "string" || step.designJson.length > 1000000)) return null;
    steps.push({ channel: step.channel as "EMAIL" | "SMS", recipient: step.recipient, sender: step.sender, subject: step.subject, body: step.body, delaySeconds: step.delaySeconds, transactional: step.transactional, condition: steps.length === 0 ? "ALWAYS" : step.condition as string, designJson: step.designJson as string | undefined });
  }
  let nextRunAt = draft.nextRunAt;
  if (nextRunAt && /(Z|[+-]\d{2}:\d{2})$/.test(nextRunAt)) {
    const instant = new Date(nextRunAt);
    if (!Number.isFinite(instant.getTime())) return null;
    nextRunAt = new Date(instant.getTime() - instant.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  }
  return { name: draft.name, trigger: draft.trigger as AutomationDraft["trigger"], eventName: draft.eventName, nextRunAt, repeatMinutes: draft.repeatMinutes, steps };
}

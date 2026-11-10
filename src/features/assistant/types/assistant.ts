import type { AutomationDraft } from "../../automations/utils/automationDraft";
export type ChatSession = { id: string; title: string; updatedAt: string; busyUntil?: string | null };
export type ChatMessage = { id: string; role: "user" | "assistant"; content: string; requestId: string; createdAt: string; draft?: AutomationDraft | null };

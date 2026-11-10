import { create } from "zustand";
import type { AutomationDraft } from "../../automations/utils/automationDraft";
type DraftState = { pending: { id: string; draft: AutomationDraft } | null; setDraft: (draft: AutomationDraft) => void; clearDraft: () => void };
export const useAssistantDraft = create<DraftState>(set => ({ pending: null, setDraft: draft => set({ pending: { id: crypto.randomUUID(), draft } }), clearDraft: () => set({ pending: null }) }));

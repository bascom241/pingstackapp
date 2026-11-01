
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type {
  CreateCampaignRequest,
  EmailRecipientRequest,
} from "../types/campaign";

export type CampaignType = "email" | "sms" | "whatsapp" | null;

interface CreateCampaignStore {
  formData: CreateCampaignRequest;
  selectedCampaignType: CampaignType;
  currentStep: number;

  setFormData: (data: Partial<CreateCampaignRequest>) => void;
  setSelectedCampaignType: (campaignType: CampaignType) => void;
  setCurrentStep: (val: number) => void;
  setTemplateId: (templateId: string) => void;
  addRecipient: (recipient: EmailRecipientRequest) => void;
  updateRecipient: (index: number, recipient: EmailRecipientRequest) => void;
  removeRecipient: (index: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  resetCampaignFlow: () => void;
}

const initialFormData: CreateCampaignRequest = {
  name: "",
  templateId: "",
  subject: "",
  recipientRequests: [],
};

export const useCreateCampaignStore = create<CreateCampaignStore>()(
  persist(
    (set) => ({
      formData: initialFormData,

      selectedCampaignType: null,
      currentStep: 0,

      setSelectedCampaignType: (campaignType) =>
        set({ selectedCampaignType: campaignType }),

      setCurrentStep: (val) => set({ currentStep: val }),

      setTemplateId: (templateId) =>
        set((state) => ({
          formData: {
            ...state.formData,
            templateId,
          },
        })),

      addRecipient: (recipient) =>
        set((state) => ({
          formData: {
            ...state.formData,
            recipientRequests: [
              ...(state.formData.recipientRequests ?? []),
              recipient,
            ],
          },
        })),

      updateRecipient: (index, recipient) =>
        set((state) => ({
          formData: {
            ...state.formData,
            recipientRequests: (state.formData.recipientRequests ?? []).map(
              (item, itemIndex) =>
                itemIndex === index ? recipient : item
            ),
          },
        })),

      removeRecipient: (index) =>
        set((state) => ({
          formData: {
            ...state.formData,
            recipientRequests: (state.formData.recipientRequests ?? []).filter(
              (_, itemIndex) => itemIndex !== index
            ),
          },
        })),

      goToNextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 3),
        })),

      goToPreviousStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 1),
        })),

      resetCampaignFlow: () =>
        set({
          selectedCampaignType: null,
          currentStep: 0,
          formData: { ...initialFormData },
        }),

      setFormData: (data) =>
        set((state) => ({
          formData: {
            ...state.formData,
            ...data,
          },
        })),
    }),
    {
      name: "pingstack-create-campaign",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

import { create } from "zustand";

interface CampaignStoreInterface {
    page: number;
    size: number;
    setPage: (page: number) => void;
}

export const useCampaignStore = create<CampaignStoreInterface>((set) => ({
    page: 0,
    size: 10,

    setPage: (page) => set({ page }),
}));
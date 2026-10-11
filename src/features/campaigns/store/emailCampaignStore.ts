import {create} from "zustand"

interface CampaignStoreInterface {
    page: number
    size: number
}

export const useCampaignStore = create<CampaignStoreInterface>((set)=> ({
    page: 0, 
    size: 10, 

}))
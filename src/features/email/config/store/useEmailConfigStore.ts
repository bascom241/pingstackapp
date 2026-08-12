import {create} from "zustand"



type ConfigStore = {
    apiPrefix: string
    rawApiKey: string
    setApiPrefix: (apiPrefix: string) => void
    setNewGenaratedRawKey: (rawApiKey: string) => void 
    warningMessage: string
    setWarningMessage: (message: string) => void
    
}
export const useEmailConfigStore = create<ConfigStore>((set)=> ({
    rawApiKey: "", 
    apiPrefix: "", 
    warningMessage: "",
    setApiPrefix: (apiPrefix) => set({apiPrefix}), 
    setNewGenaratedRawKey: (rawApiKey) => set ({rawApiKey}),
    setWarningMessage: (warningMessage) => set({warningMessage})

}))
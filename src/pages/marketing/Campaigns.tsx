

import { useState } from "react"
import CampaignHeader from "../../components/dashboard/campaigns/CampaignHeader"
import EmptyCartonState from "../../components/dashboard/campaigns/EmptyCartonState"
import SelectCampaign from "../../components/dashboard/campaigns/SelectCampaign"
import { useCampaign } from "../../features/campaigns/hooks/useEmailCampaign"
import { useCampaignStore } from "../../features/campaigns/store/emailCampaignStore"
import ErrorCampaign from "../../../utils/ErrorUI"
import { Loader2 } from "lucide-react"
const Campaigns = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { page, size } = useCampaignStore()
    const { data: campaignData, isPending: fetchingCampaignData, isError: campaignError } = useCampaign(page, size)
    console.log(campaignData)

    if (fetchingCampaignData) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <Loader2 className=" animate-spin text-[#004aad]" size={64}/>
            </div>
        )
    }

    if(campaignError){
        return (
            <ErrorCampaign  
                text="Campaigns"
            />
        )
    }



    return (
        <main>
            {/** Header */}
            <CampaignHeader
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
            <EmptyCartonState
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />

            {isOpen && <SelectCampaign isOpen={isOpen} setIsOpen={setIsOpen} />}

        </main>
    )
}

export default Campaigns
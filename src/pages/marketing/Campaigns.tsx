
import { useState } from "react";
import { Loader2 } from "lucide-react";

import CampaignHeader from "../../components/dashboard/campaigns/CampaignHeader";
import EmptyCartonState from "../../components/dashboard/campaigns/EmptyCartonState";
import SelectCampaign from "../../components/dashboard/campaigns/SelectCampaign";
import CampaignList from "../../components/dashboard/campaigns/CampaignList";

import { useCampaign } from "../../features/campaigns/hooks/useEmailCampaign";
import { useCampaignStore } from "../../features/campaigns/store/emailCampaignStore";

import ErrorCampaign from "../../../utils/ErrorUI";

const Campaigns = () => {
    const [isOpen, setIsOpen] = useState(false);

    const { page, size, setPage } = useCampaignStore();

    const {
        data: campaignData,
        isPending: fetchingCampaignData,
        isError: campaignError,
    } = useCampaign(page, size);

    if (fetchingCampaignData) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="animate-spin text-[#004aad]" size={50} />
            </div>
        );
    }

    if (campaignError) {
        return <ErrorCampaign text="Campaigns" />;
    }

    const hasCampaigns = (campaignData?.content?.length ?? 0) > 0;

    return (
        <main className="min-h-screen w-full bg-white px-5 py-8 sm:px-8">

            <CampaignHeader
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />

            {hasCampaigns ? (
                <CampaignList
                    data={campaignData}
                    onPageChange={setPage}
                />
            ) : (
                <EmptyCartonState
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                />
            )}

            {isOpen && (
                <SelectCampaign
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                />
            )}

        </main>
    );
};

export default Campaigns;

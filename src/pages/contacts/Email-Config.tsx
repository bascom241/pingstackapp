import { useEffect, useState } from "react";
import {
  Send
} from "lucide-react";
import DomainManagement from "../../ui/modals/DomainManagement";
type DnsRecord = {
  recordName: string
  type: "TXT" | "CNAME";
  hostName: string;
  value: string;
  status: "Verified" | "Pending";
};

type DomainConfigResponse = {
  domain: string;
  verified: boolean;
  dnsRecords: DnsRecord[];
};

import { useGetEmailConfig } from "../../features/email/config/hooks/useEmailConfig";
import { useEmailConfigStore } from "../../features/email/config/store/useEmailConfigStore";
import ApiKeyModal from "../../ui/modals/ApiKeyModa";
import TrackOptions from "../../ui/modals/TrackOptions";
export default function UserEmailConfig() {
  const { data, isLoading, isError } = useGetEmailConfig();
  const { apiPrefix, setApiPrefix } = useEmailConfigStore()
  console.log(data);

  useEffect(() => {
    if (data) {
      setApiPrefix(data.apiKeyPrefix)
    }
  }, [data, setApiPrefix])

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 p-4 relative">
      {/* Header Context Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Email Delivery & API Settings
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage your Pingstack API credentials, verify custom domains, and
            configure deliverability options.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl text-xs text-[#004aad]">
          <Send size={14} />
          <span className="font-semibold">
            Monthly Limit: {data?.emailsSentThisMonth ?? 0} / {data?.monthlyLimit ?? 0} sent
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Controls (Left 2-Columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: API Key & Integration Credentials */}
          <ApiKeyModal
            setApiPrex={setApiPrefix}
            apiPrefix={data?.apiKeyPrefix}
          />
          {/* Section 2: Domain Verification (Sending Domain) */}

          <DomainManagement />
        </div>

        {/* Section 3: Prefernce update (Sending Domain) */}
        {data ? (
          <TrackOptions data={data} />
        ) : null}
      </div>


    </div>
  );
}
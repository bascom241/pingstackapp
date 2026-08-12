// src/components/email/DomainManagement.tsx
import { useState } from "react";
import type { BrevoDomainDto } from "../../types/email/EmailConfigDto";
import { DomainList } from "./DomainList";
import { DomainDetailsModal } from "./DomainDetails";
import {
  useCreateDomain,
  useGetAllDomains,
} from "../../features/email/config/hooks/useDomain";
import { useSnackbar } from "notistack";
import { getApiErrorMessage } from "../../utils/apiError";

const DomainManagement = () => {
  // Extract refetch and isRefetching directly from the domains query
  const {
    data: domains = [],
    isPending: isInitialLoading,
    isRefetching,
    refetch: refetchDomains,
  } = useGetAllDomains();

  const [selectedDomain, setSelectedDomain] = useState<BrevoDomainDto | null>(null);
  const [newDomainInput, setNewDomainInput] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const { mutate: createDomain, isPending: isAddingDomain } = useCreateDomain();
  const { enqueueSnackbar } = useSnackbar();

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const addDomain = () => {
    if (!newDomainInput.trim()) return;

    createDomain(
      { customDomain: newDomainInput.trim() },
      {
        onSuccess: async () => {
          enqueueSnackbar("Domain created successfully", { variant: "success" });
          setNewDomainInput("");
          // Refetch domains explicitly after adding
          await refetchDomains();
        },
        onError: (error) => {
          const errorMessage = getApiErrorMessage(error, "Failed to add Domain");
          enqueueSnackbar(errorMessage, { variant: "error" });
        },
      }
    );
  };

  return (
    <>
      <DomainList
        domains={domains}
        newDomainInput={newDomainInput}
        onInputChange={setNewDomainInput}
        onAddDomain={addDomain}
        onSelectDomain={setSelectedDomain}
        isAddingDomain={isAddingDomain}
        // Shows full list loading/spinner whenever initial loading OR refetching is happening
        isFetchingDomains={isInitialLoading || isRefetching}
        onRefetchDomains={refetchDomains}
      />

      <DomainDetailsModal
        selectedDomain={selectedDomain}
        isVerifying={isVerifying === selectedDomain?.id}
        copiedKey={copiedKey}
        onClose={() => setSelectedDomain(null)}
        onCopy={handleCopy}
      />
    </>
  );
};

export default DomainManagement;
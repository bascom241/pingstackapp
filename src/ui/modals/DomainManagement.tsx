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
  const {
    data: domains = [],
    isPending: isInitialLoading,
    isRefetching,
    isError,
    refetch: refetchDomains,
  } = useGetAllDomains();

  const [selectedDomain, setSelectedDomain] = useState<BrevoDomainDto | null>(null);
  const [newDomainInput, setNewDomainInput] = useState<string>("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const { mutate: createDomain, isPending: isAddingDomain } = useCreateDomain();
  const { enqueueSnackbar } = useSnackbar();

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(previous => previous === key ? null : previous), 2000);
    } catch {
      enqueueSnackbar("Couldn’t copy this value. Select and copy it manually.", { variant: "error" });
    }
  };

  const addDomain = () => {
    if (!newDomainInput.trim() || isAddingDomain) return;

    createDomain(
      { customDomain: newDomainInput.trim() },
      {
        onSuccess: async () => {
          enqueueSnackbar("Domain created successfully", { variant: "success" });
          setNewDomainInput("");
          await refetchDomains();
        },
        onError: (error) => {
          const errorMessage = getApiErrorMessage(error, "Failed to add Domain");
          enqueueSnackbar(errorMessage, { variant: "error" });
        },
      }
    );
  };

  // Callback executed after the modal completes setting primary status
  const handlePrimarySetSuccess = async () => {
    await refetchDomains();
    setSelectedDomain(null);
  };

  return (
    <>
      <DomainList
        domains={domains}
        isDomainError={isError}
        newDomainInput={newDomainInput}
        onInputChange={setNewDomainInput}
        onAddDomain={addDomain}
        onSelectDomain={setSelectedDomain}
        isAddingDomain={isAddingDomain}
        isFetchingDomains={isInitialLoading || isRefetching}
        onRefetchDomains={refetchDomains}
      />

      <DomainDetailsModal
        selectedDomain={selectedDomain}
        onSetPrimarySuccess={handlePrimarySetSuccess}
        copiedKey={copiedKey}
        onClose={() => setSelectedDomain(null)}
        onCopy={handleCopy}
      />
    </>
  );
};

export default DomainManagement;
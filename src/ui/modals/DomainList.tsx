// src/components/email/DomainList.tsx
import React, { useState } from "react";
import {
  Globe,
  Plus,
  Server,
  Star,
  Trash2,
  ChevronRight,
  Loader2,
} from "lucide-react";

import type { BrevoDomainDto } from "../../types/email/EmailConfigDto";
import {
  useMakeDomainPrimary,
  useDeleteDomain,
} from "../../features/email/config/hooks/useDomain";
import { useSnackbar } from "notistack";
import { getApiErrorMessage } from "../../utils/apiError";
import DeleteDomainModal from "./DeleteDomainModal";

interface DomainListProps {
  domains: BrevoDomainDto[];
  newDomainInput: string;
  onInputChange: (val: string) => void;
  onAddDomain: () => void;
  onSelectDomain: (domain: BrevoDomainDto) => void;
  isAddingDomain: boolean;
  isFetchingDomains: boolean;
  onRefetchDomains: () => void;
}

export const DomainList: React.FC<DomainListProps> = ({
  domains,
  newDomainInput,
  onInputChange,
  onAddDomain,
  onSelectDomain,
  isAddingDomain,
  isFetchingDomains,
  onRefetchDomains,
}) => {
  const [targetDomainId, setTargetDomainId] = useState<string | null>(null);
  const [domainToDelete, setDomainToDelete] = useState<BrevoDomainDto | null>(null);

  const { mutate: makePrimary, isPending: isSettingPrimary } = useMakeDomainPrimary();
  const { mutate: deleteDomain, isPending: isDeletingDomain } = useDeleteDomain();
  const { enqueueSnackbar } = useSnackbar();

  const handleMakeDomainPrimary = (domainId: string) => {
    setTargetDomainId(domainId);

    makePrimary(domainId, {
      onSuccess: async () => {
        setTargetDomainId(null);
        await onRefetchDomains();
        enqueueSnackbar("Domain set as primary successfully", { variant: "success" });
      },
      onError: (error) => {
        setTargetDomainId(null);
        const errorMessage = getApiErrorMessage(error, "Failed to set domain as primary");
        enqueueSnackbar(errorMessage, { variant: "error" });
      },
    });
  };

  const handleOpenDeleteModal = (domain: BrevoDomainDto) => {
    setDomainToDelete(domain);
  };

  const handleConfirmDelete = () => {
    if (!domainToDelete?.id) {
      enqueueSnackbar("No domain selected for deletion", { variant: "error" });
      return;
    }

    if (isDeletingDomain) {
      return;
    }

    deleteDomain(domainToDelete.id, {
      onSuccess: async () => {
        enqueueSnackbar(
          `Domain "${domainToDelete.domain_name}" deleted successfully`,
          { variant: "success" }
        );
        setDomainToDelete(null);

        try {
          await onRefetchDomains();
        } catch (error) {
          console.error("Failed to refetch domains:", error);
        }
      },
      onError: (error) => {
        setDomainToDelete(null);
        console.error("Delete domain error:", error);
        const errorMessage = getApiErrorMessage(
          error,
          "Failed to delete domain"
        );
        enqueueSnackbar(errorMessage, { variant: "error" });
      },
    });
  };

  return (
    <>
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-50">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <Globe size={16} />
            </div>
            <div>
              <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                Sending Domains
              </h2>
              <p className="text-[11px] text-gray-400">
                Manage custom sending identities and DNS verifications.
              </p>
            </div>
          </div>
        </div>

        {/* Domain Registration Form */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newDomainInput}
            disabled={isFetchingDomains || isAddingDomain}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="e.g. email.yourdomain.com"
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono text-gray-700 outline-none focus:ring-2 focus:ring-[#004aad]/10 focus:border-[#004aad] disabled:opacity-50"
          />
          <button
            type="button"
            onClick={onAddDomain}
            disabled={!newDomainInput.trim() || isAddingDomain || isFetchingDomains}
            className="bg-gray-900 hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0 flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {isAddingDomain ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <>
                <Plus size={14} /> <span>Add Domain</span>
              </>
            )}
          </button>
        </div>

        {/* Domain List Container */}
        <div className="space-y-3">
          {isFetchingDomains ? (
            <div className="p-12 text-center border border-dashed border-gray-200 rounded-xl text-gray-400 text-xs flex flex-col items-center justify-center gap-2 bg-gray-50/50">
              <Loader2 className="animate-spin text-[#004aad]" size={28} />
              <p className="font-medium text-gray-600">Updating domain list...</p>
            </div>
          ) : domains.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-gray-200 rounded-xl text-gray-400 text-xs">
              No sending domains configured. Add a domain above to start sending emails.
            </div>
          ) : (
            domains.map((domain) => (
              <div
                key={domain.id}
                onClick={() => !isFetchingDomains && onSelectDomain(domain)}
                className="bg-gray-50/70 hover:bg-gray-50 border border-gray-200/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all cursor-pointer group"
              >
                {/* Domain Info */}
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg shrink-0 ${
                      domain.verified
                        ? "bg-emerald-100/70 text-emerald-700"
                        : "bg-amber-100/70 text-amber-700"
                    }`}
                  >
                    <Server size={16} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-gray-900 text-sm group-hover:text-[#004aad] transition-colors">
                        {domain.domain_name}
                      </span>
                      {domain.primary && (
                        <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Star size={9} className="fill-amber-800" /> Primary
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                      <span>{domain.domain_provider}</span>
                      <span>•</span>
                      <span
                        className={`font-semibold ${
                          domain.verified ? "text-emerald-600" : "text-amber-600"
                        }`}
                      >
                        {domain.verified ? "Verified" : "Pending Records"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div
                  className="flex items-center gap-2.5 self-end sm:self-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {!domain.primary && (
                    <button
                      type="button"
                      disabled={isFetchingDomains || (isSettingPrimary && targetDomainId === domain.id)}
                      onClick={() => handleMakeDomainPrimary(domain.id)}
                      className="text-[11px] font-medium text-gray-500 hover:text-amber-600 px-2.5 py-1 rounded-lg border border-gray-200 bg-white hover:bg-amber-50/50 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1"
                    >
                      {isSettingPrimary && targetDomainId === domain.id ? (
                        <Loader2 className="animate-spin" size={12} />
                      ) : (
                        "Make Primary"
                      )}
                    </button>
                  )}

                  <button
                    type="button"
                    title="Delete domain"
                    disabled={isDeletingDomain || isFetchingDomains}
                    onClick={() => handleOpenDeleteModal(domain)}
                    className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-gray-200/50 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                  </button>

                  <div className="text-gray-400 group-hover:text-gray-700 transition-colors pl-1">
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Modal Confirmation */}
      <DeleteDomainModal
        isOpen={!!domainToDelete}
        onClose={() => setDomainToDelete(null)}
        domainName={domainToDelete?.domain_name || ""}
        onConfirmDelete={handleConfirmDelete}
        isDeleting={isDeletingDomain}
      />
    </>
  );
};
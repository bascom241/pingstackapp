import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Star,
  SearchCheck,
  CheckCircle2,
  AlertCircle,
  Check,
  Copy,
  Server,
  Loader2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import type { BrevoDomainDto, DnsRecordDetails, VerifyDomainRequest } from "../../types/email/EmailConfigDto";
import {
  useGetSingleDomain,
  useMakeDomainPrimary,
  DOMAIN_QUERY_KEY,
} from "../../features/email/config/hooks/useDomain";
import {
  useVerifyDomain,
  EMAIL_CONFIG_QUERY,
} from "../../features/email/config/hooks/useEmailConfig";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { getApiErrorMessage } from "../../utils/apiError";

interface DomainDetailsModalProps {
  selectedDomain: BrevoDomainDto | null;
  copiedKey: string | null;
  onClose: () => void;
  onSetPrimarySuccess: () => void | Promise<void>;
  onCopy: (text: string, key: string) => void;
}

export const DomainDetailsModal: React.FC<DomainDetailsModalProps> = ({
  selectedDomain,
  copiedKey,
  onClose,
  onSetPrimarySuccess,
  onCopy,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { data, isPending } = useGetSingleDomain(selectedDomain?.id);
  const { mutate: makePrimary, isPending: isSettingPrimary } = useMakeDomainPrimary();
  const { mutate: verifyDomain, isPending: isVerifying } = useVerifyDomain();

  // Prevent browser refresh or navigation during verification process
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isVerifying) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isVerifying]);

  if (!selectedDomain) return null;

  const isPrimaryDomain = selectedDomain.primary || data?.primary;

  const handleVerify = () => {
    const domainName = data?.domain_name || selectedDomain.domain_name;
    const domainId = data?.id || selectedDomain.id
    if (!domainName || !domainId) return;

    const payload: VerifyDomainRequest = { domainName , domainId};

    console.log(payload)

    verifyDomain(payload, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: [DOMAIN_QUERY_KEY] });
        await queryClient.invalidateQueries({ queryKey: [EMAIL_CONFIG_QUERY] });
        enqueueSnackbar("DNS verification completed successfully", { variant: "success" });
      },
      onError: (error) => {
        const errorMessage = getApiErrorMessage(error, "Failed to verify DNS records");
        enqueueSnackbar(errorMessage, { variant: "error" });
      },
    });
  };

  const handleSetPrimaryClick = () => {
    const targetDomainId = data?.id || selectedDomain.id;
    if (!targetDomainId) return;

    makePrimary(targetDomainId, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: [DOMAIN_QUERY_KEY] });
        await queryClient.invalidateQueries({ queryKey: [EMAIL_CONFIG_QUERY] });
        enqueueSnackbar("Domain set as primary successfully", { variant: "success" });
        await onSetPrimarySuccess();
      },
      onError: (error) => {
        const errorMessage = getApiErrorMessage(error, "Failed to set domain as primary");
        enqueueSnackbar(errorMessage, { variant: "error" });
      },
    });
  };

  const recordsList = Object.entries(data?.dns_records ?? {}) as unknown as [
    string,
    DnsRecordDetails
  ][];


  console.log(selectedDomain)

  return (
    <>
      {/* Page-Wide Overlay Portal rendered when isVerifying is active */}
      {isVerifying &&
        createPortal(
          <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-gray-100 text-center space-y-4">
              <div className="inline-flex p-3 bg-amber-50 rounded-2xl text-amber-600 mb-1">
                <Loader2 className="animate-spin text-[#004aad]" size={32} />
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-gray-900">
                  Verifying DNS Records
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  DNS updates take time to propagate across global servers. We are checking your records now—please keep this window open.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2.5 text-left text-xs text-amber-900">
                <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={16} />
                <span>
                  <strong>Please wait:</strong> Navigating away or closing the page during verification will trigger a warning alert.
                </span>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Main Modal Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => !isSettingPrimary && !isVerifying && onClose()}
      >
        <div
          className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-3xl max-h-[88vh] sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Handle */}
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-2 shrink-0 sm:hidden" />

          {/* Header Area */}
          <div className="p-4 sm:px-6 sm:py-4 border-b border-gray-100 bg-gray-50/60 shrink-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 bg-[#004aad]/10 text-[#004aad] rounded-xl shrink-0">
                  <Server size={18} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-sm font-bold font-mono text-gray-900 truncate">
                      {data?.domain_name || selectedDomain.domain_name}
                    </h2>
                    {isPrimaryDomain && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                        <Star size={10} className="fill-amber-800" /> Primary
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                    Provider:{" "}
                    <strong className="text-gray-600">
                      {data?.domain_provider || selectedDomain.domain_provider}
                    </strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                disabled={isSettingPrimary || isVerifying}
                className="text-gray-400 hover:text-gray-700 p-2 sm:p-1.5 rounded-lg hover:bg-gray-200/60 transition-colors cursor-pointer shrink-0 -mr-1 -mt-1 disabled:opacity-50"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Action Buttons Row */}
            {!isPending && data !== null && (
              <div className="flex items-center gap-2 mt-3 sm:mt-3">
                {!data?.verified && (
                  <button
                    type="button"
                    onClick={handleVerify}
                    disabled={isVerifying || isSettingPrimary}
                    className="flex-1 sm:flex-none justify-center bg-[#004aad] hover:bg-[#003985] text-white text-xs font-semibold px-3.5 py-2 sm:py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
                  >
                    <SearchCheck
                      size={14}
                      className={isVerifying ? "animate-spin" : ""}
                    />
                    <span>{isVerifying ? "Verifying..." : "Verify DNS"}</span>
                  </button>
                )}

                {!isPrimaryDomain && (
                  <button
                    type="button"
                    onClick={handleSetPrimaryClick}
                    disabled={isSettingPrimary || isVerifying}
                    className="flex-1 sm:flex-none justify-center text-xs font-semibold px-3.5 py-2 sm:py-1.5 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {isSettingPrimary ? (
                      <Loader2 size={13} className="animate-spin text-amber-500" />
                    ) : (
                      <Star size={13} className="text-amber-500" />
                    )}
                    <span>
                      {isSettingPrimary ? "Setting Primary..." : "Set Primary"}
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Scrollable Body */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto grow flex flex-col">
            {isPending ? (
              <div className="flex flex-col items-center justify-center my-auto py-12 gap-3 text-gray-500">
                <Loader2 className="animate-spin text-[#004aad]" size={40} />
                <p className="text-xs font-medium">Fetching domain details...</p>
              </div>
            ) : data === null ? (
              <div className="flex flex-col items-center justify-center my-auto py-12 text-center">
                <div className="p-3 bg-red-100 text-red-600 rounded-full mb-3">
                  <AlertCircle size={28} />
                </div>
                <h3 className="text-sm font-bold text-gray-900">
                  Error Fetching Details
                </h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm">
                  Unable to load domain details. Please try again or close this panel.
                </p>
              </div>
            ) : (
              <>
                {/* Propagation Banner */}
                <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
                  <Clock className="text-amber-600 shrink-0 mt-0.5" size={15} />
                  <div>
                    <span className="font-semibold">Propagation delay notice:</span> DNS changes can take anywhere from a few minutes up to 24–48 hours to update globally across all servers.
                  </div>
                </div>

                {/* Status Banner */}
                <div
                  className={`p-3.5 rounded-xl border flex items-start sm:items-center gap-2.5 ${
                    data?.verified
                      ? "bg-emerald-50/70 border-emerald-200 text-emerald-800"
                      : "bg-amber-50/70 border-amber-200 text-amber-800"
                  }`}
                >
                  {data?.verified ? (
                    <CheckCircle2
                      size={18}
                      className="text-emerald-600 shrink-0 mt-0.5 sm:mt-0"
                    />
                  ) : (
                    <AlertCircle
                      size={18}
                      className="text-amber-600 shrink-0 mt-0.5 sm:mt-0"
                    />
                  )}
                  <div>
                    <p className="text-xs font-bold">
                      {data?.verified
                        ? "Domain Authenticated & Ready"
                        : "DNS Setup Required"}
                    </p>
                    <p className="text-[11px] opacity-90 leading-relaxed mt-0.5">
                      {data?.verified
                        ? "Your domain records are verified and active for outbound sending."
                        : "Add the records below to your DNS management console."}
                    </p>
                  </div>
                </div>

                {/* Section Heading */}
                <div>
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                    DNS Configuration Records
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Copy these values into Cloudflare, GoDaddy, or Namecheap.
                  </p>
                </div>

                {/* Records Stack */}
                <div className="space-y-3">
                  {recordsList.map(([key, record]: [string, DnsRecordDetails]) => {
                    const isRecordVerified = record.status;
                    return (
                      <div
                        key={key}
                        className="bg-gray-50/70 border border-gray-200/80 rounded-xl p-3.5 sm:p-4 space-y-3 font-mono text-xs"
                      >
                        <div className="flex items-center justify-between border-b border-gray-200/60 pb-2 font-sans">
                          <div className="flex items-center gap-2">
                            <span className="bg-gray-900 text-white font-bold px-2 py-0.5 rounded text-[10px]">
                              {record.type}
                            </span>
                            <span className="font-semibold text-gray-700 text-xs uppercase tracking-wider truncate max-w-[140px] sm:max-w-none">
                              {record.recordName}
                            </span>
                          </div>

                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0 ${
                              isRecordVerified
                                ? "bg-emerald-100/80 text-emerald-800"
                                : "bg-amber-100/80 text-amber-800"
                            }`}
                          >
                            {isRecordVerified ? (
                              <CheckCircle2 size={11} />
                            ) : (
                              <AlertCircle size={11} />
                            )}
                            {isRecordVerified ? "Verified" : "Unverified"}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-0.5">
                          {/* Host Name Field */}
                          <div className="sm:col-span-1">
                            <span className="text-[10px] font-sans text-gray-400 block uppercase font-medium">
                              Host Name
                            </span>
                            <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200 mt-1 shadow-2xs gap-2">
                              <span className="text-gray-800 font-semibold truncate break-all select-all">
                                {record.host_name}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  onCopy(record.host_name, `${key}-host`)
                                }
                                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-md hover:bg-gray-100 shrink-0 cursor-pointer active:scale-95 transition-transform"
                                title="Copy Host Name"
                              >
                                {copiedKey === `${key}-host` ? (
                                  <Check
                                    size={14}
                                    className="text-emerald-600"
                                  />
                                ) : (
                                  <Copy size={14} />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Value Field */}
                          <div className="sm:col-span-2">
                            <span className="text-[10px] font-sans text-gray-400 block uppercase font-medium">
                              Value
                            </span>
                            <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200 mt-1 shadow-2xs gap-2">
                              <span className="text-gray-600 truncate break-all select-all">
                                {record.value}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  onCopy(record.value, `${key}-value`)
                                }
                                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-md hover:bg-gray-100 shrink-0 cursor-pointer active:scale-95 transition-transform"
                                title="Copy Value"
                              >
                                {copiedKey === `${key}-value` ? (
                                  <Check
                                    size={14}
                                    className="text-emerald-600"
                                  />
                                ) : (
                                  <Copy size={14} />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Footer Area */}
          <div className="p-3 sm:px-6 sm:py-3 border-t border-gray-100 bg-gray-50/60 shrink-0 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSettingPrimary || isVerifying}
              className="w-full sm:w-auto text-xs font-semibold px-4 py-2.5 sm:py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
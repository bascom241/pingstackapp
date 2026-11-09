import { DataSkeleton, InlineSkeleton } from "../Skeleton";
// src/components/email/DomainList.tsx
import React, { useState } from "react";
import { Globe, Plus, Star, Trash2, ArrowRight, Loader2 } from "../icons";
import { EmailSectionHeading, StatusMark } from "../../components/messaging/EmailConfigElements";

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
  isDomainError: boolean;
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
  isDomainError,
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
      <section className="email-settings-card" aria-label="Sending domains">
        <EmailSectionHeading icon={<Globe size={23} />} title="Sending domains" description="Send from an address your audience recognizes. Connect your domain and verify its DNS records." />
        <div className="email-section-body">
          <form className="email-domain-form" onSubmit={(event) => { event.preventDefault(); if (newDomainInput.trim() && !isAddingDomain && !isFetchingDomains) onAddDomain() }}>
            <label htmlFor="new-sending-domain" className="email-field-label">Connect a domain</label>
            <div className="email-domain-form-row">
              <input id="new-sending-domain" type="text" autoComplete="off" autoCapitalize="none" spellCheck={false} required value={newDomainInput} disabled={isAddingDomain} onChange={(event) => onInputChange(event.target.value)} placeholder="mail.yourcompany.com" className="email-input" aria-describedby="sending-domain-help" />
              <button type="submit" disabled={!newDomainInput.trim() || isAddingDomain || isFetchingDomains} className="email-button is-primary">{isAddingDomain ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}{isAddingDomain ? 'Connecting…' : 'Connect domain'}</button>
            </div>
            <p id="sending-domain-help" className="email-helper">Use a domain you own. We’ll provide the DNS records to add with your domain provider.</p>
          </form>
          <div className="email-domains-label">Your domains <span className="email-count">{isFetchingDomains && !domains.length ? <InlineSkeleton width={16} height={12} label="Loading domain count" /> : domains.length}</span></div>
          <div className="email-domain-stack" aria-busy={isFetchingDomains}>
            {isDomainError ? <div className="email-empty" role="alert"><h3>Couldn’t refresh your domains</h3><p>Please try again to see your current sending domains.</p><button type="button" className="email-button" onClick={onRefetchDomains}>Try again</button></div> : isFetchingDomains && domains.length === 0 ? <DataSkeleton layout="list" rows={2} label="Loading sending domains" /> : domains.length === 0 ? <div className="email-empty"><span className="email-section-icon"><Globe size={25} /></span><h3>Your brand starts with your domain</h3><p>Connect your first domain above.<br />We’ll walk you through the DNS setup next.</p></div> : domains.map(domain => (
              <article key={domain.id} className="email-domain-card">
                <div className="email-domain-top">
                  <span className="email-domain-globe"><Globe size={22} /></span>
                  <div className="email-domain-info">
                    <div className="email-domain-name"><h3>{domain.domain_name}</h3>{domain.primary && <span className="email-primary-badge"><Star size={12} />Primary</span>}</div>
                    <div className="email-domain-meta"><span className={`email-status-label ${domain.verified ? '' : 'is-pending'}`}><StatusMark verified={domain.verified} />{domain.verified ? 'Verified' : 'Needs verification'}</span>{domain.domain_provider && <span>{domain.domain_provider}</span>}</div>
                  </div>
                  <button type="button" aria-label={`Delete ${domain.domain_name}`} disabled={isDeletingDomain || isFetchingDomains} onClick={() => handleOpenDeleteModal(domain)} className="email-delete-button"><Trash2 size={18} /></button>
                </div>
                <div className="email-domain-footer">
                  <p>{domain.verified ? domain.primary ? 'Your default domain for outgoing emails.' : 'DNS verified. Your domain is ready to send.' : 'Add your DNS records to authenticate this domain.'}</p>
                  <div className="email-domain-actions">
                    {!domain.primary && <button type="button" disabled={isFetchingDomains || isSettingPrimary} onClick={() => handleMakeDomainPrimary(domain.id)} className="email-button">{isSettingPrimary && targetDomainId === domain.id ? <Loader2 size={16} className="animate-spin" /> : null}Make primary</button>}
                    <button type="button" onClick={() => onSelectDomain(domain)} className="email-button">{domain.verified ? 'View DNS records' : 'Complete setup'}<ArrowRight size={16} /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

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
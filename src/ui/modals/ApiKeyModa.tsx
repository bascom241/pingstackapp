import { EmailSectionHeading } from "../../components/messaging/EmailConfigElements";
import { Key, RefreshCw, Loader2 } from "../icons"
import { useGenerateApiKey } from "../../features/email/config/hooks/useEmailConfig"
import { useSnackbar } from "notistack"
import { getApiErrorMessage } from "../../utils/apiError"
import ApiKeyGeneratedMessage from "./ApiKeyGeneratedMessage"
import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { useEmailConfigStore } from "../../features/email/config/store/useEmailConfigStore"
import { useQueryClient } from "@tanstack/react-query"
import { EMAIL_CONFIG_QUERY } from "../../features/email/config/hooks/useEmailConfig"
interface ApiKeyModalInterface {
    apiPrefix: string | undefined
    setApiPrex: (value: string) => void
}

const ApiKeyModal = ({ apiPrefix, setApiPrex }: ApiKeyModalInterface) => {

    const { mutate, isPending: isGenerating } = useGenerateApiKey();
    const { enqueueSnackbar } = useSnackbar();
    const [openApiKeyModal, setOpenApiKeyModal] = useState(false);
    const { setNewGenaratedRawKey, rawApiKey, setWarningMessage, warningMessage } = useEmailConfigStore();
    const queryClient = useQueryClient();
    const handleRegenerateKey = () => {
        if (isGenerating) return;
        mutate(undefined, {
            onSuccess: (data) => {
                setOpenApiKeyModal(true);
                setApiPrex(data.apiKeyPrefix);
                setNewGenaratedRawKey(data.rawApiKey);
                setWarningMessage(data.message);
                queryClient.invalidateQueries({
                    queryKey: EMAIL_CONFIG_QUERY,
                });
            },
            onError: (error) => {
                console.error("ApiKey Genaration Error:", error);
                const errorMessage = getApiErrorMessage(error, "Something went wrong");
                enqueueSnackbar(errorMessage || "Api Key Generation Failed", {
                    variant: "error"
                })
            }
        })
    }



    return (
        <section className="email-settings-card" aria-label="Email API credentials">
            <EmailSectionHeading icon={<Key size={23} />} title="API credentials" description="Connect your application to Pingstack and send emails from your own workflows." />
            <div className="email-section-body">
                <label htmlFor="email-api-key-prefix" className="email-field-label">API key prefix</label>
                <div className="email-domain-form-row">
                    <input id="email-api-key-prefix" type="text" readOnly value={apiPrefix || 'No API key generated'} className="email-input !bg-slate-50 font-mono !text-sm" aria-describedby="email-api-key-help" />
                    <button type="button" disabled={isGenerating} onClick={handleRegenerateKey} className="email-button">{isGenerating ? <Loader2 size={17} className="animate-spin" /> : <RefreshCw size={17} />}{isGenerating ? 'Generating…' : apiPrefix ? 'Regenerate key' : 'Generate API key'}</button>
                </div>
                <p id="email-api-key-help" className="email-helper">Only the prefix is shown here. The full key is displayed once when generated. Regenerating a key replaces your current credentials.</p>
            </div>

            <AnimatePresence>
                {openApiKeyModal && (
                    <ApiKeyGeneratedMessage
                        setOpen={setOpenApiKeyModal}
                        apiKey={rawApiKey}
                        message={warningMessage}
                    />
                )}
            </AnimatePresence>
        </section>
    )
}

export default ApiKeyModal

import { Key, RefreshCw } from "lucide-react"
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

    const { mutate, isPending: isGenerating, isError } = useGenerateApiKey();
    const { enqueueSnackbar } = useSnackbar();
    const [openApiKeyModal, setOpenApiKeyModal] = useState(false);
    const { setNewGenaratedRawKey, rawApiKey, setWarningMessage, warningMessage } = useEmailConfigStore();
    const queryClient = useQueryClient();
    const handleRegenerateKey = () => {
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
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-blue-50 text-[#004aad] rounded-lg">
                        <Key size={15} />
                    </div>
                    <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                        Your Pingstack API Access Key
                    </h2>
                </div>
                <button
                    type="button"
                    disabled={isGenerating}
                    className="text-[11px] text-[#004aad] font-semibold hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"

                >
                    <RefreshCw
                        size={11}
                        className={isGenerating ? "animate-spin" : ""}
                    />{" "}
                    {isGenerating ? "Generating..." : "Regenerate Key"}
                </button>
            </div>

            <p className="text-[11px] text-gray-400">
                For security reasons, API keys are hashed in our database and
                cannot be retrieved after generation.
            </p>

            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase text-gray-400">
                    Production API Key
                </label>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        readOnly
                        value={apiPrefix ?? ""}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono text-gray-500 outline-none select-none cursor-not-allowed"
                    />
                    <button
                        type="button"
                        onClick={handleRegenerateKey}
                        className="bg-[#004aad] hover:bg-[#003985] text-white px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                        <RefreshCw size={12} />
                        <span>Roll Key</span>
                    </button>
                </div>
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
        </div>
    )
}

export default ApiKeyModal

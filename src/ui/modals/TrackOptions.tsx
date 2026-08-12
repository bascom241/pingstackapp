import { useEffect, useState } from "react";
import { Loader2, Save, ShieldCheck } from "lucide-react";
import type { EmailConfigResponse } from "../../types/email/EmailConfigDto";
import { useUpdatePreference } from "../../features/email/config/hooks/useEmailConfig";
import { useSnackbar } from "notistack";
import { getApiErrorMessage } from "../../utils/apiError";
import { useQueryClient } from "@tanstack/react-query";
import { EMAIL_CONFIG_QUERY } from "../../features/email/config/hooks/useEmailConfig"
interface TrackOptions {
    data: EmailConfigResponse
}
const TrackOptions = ({ data }: TrackOptions) => {

    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient()
    const { trackOpens, trackClicks, bounceAlerts } = data;
    console.log(trackOpens, trackClicks, bounceAlerts)
    const [settings, setSettings] = useState({
        trackOpens,
        trackClicks,
        bounceAlerts,
    });
    const { mutate, isPending } = useUpdatePreference()

    const handlePreference = () => {
        mutate(settings, {
            onSuccess: (data) => {
                queryClient.invalidateQueries({ queryKey: EMAIL_CONFIG_QUERY })
                enqueueSnackbar("Prefrence updated", { variant: "success" })
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


    useEffect(() => {
        setSettings({
            trackOpens: data.trackOpens,
            trackClicks: data.trackClicks,
            bounceAlerts: data.bounceAlerts,
        })
    }, [data])

    return (
        <div className="space-y-6">
            {/* Tracking Options */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-gray-50">
                    <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                        <ShieldCheck size={15} />
                    </div>
                    <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                        Tracking & Analytics
                    </h2>
                </div>

                <div className="space-y-3 pt-1">
                    {[
                        {
                            key: "trackOpens",
                            title: "Track Email Opens",
                            desc: "Know when your users open your emails.",
                        },
                        {
                            key: "trackClicks",
                            title: "Track Link Clicks",
                            desc: "Track when links inside your emails are clicked.",
                        },
                        {
                            key: "bounceAlerts",
                            title: "Bounce Alerts",
                            desc: "Get notified if an email fails to deliver.",
                        },
                    ].map((item) => {
                        const isChecked =
                            settings[item.key as keyof typeof settings];
                        return (
                            <div
                                key={item.key}
                                className="flex items-start justify-between gap-4"
                            >
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-xs font-bold text-gray-700">
                                        {item.title}
                                    </span>
                                    <span className="text-[10px] text-gray-400 leading-normal">
                                        {item.desc}
                                    </span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() =>
                                        setSettings((prev) => ({
                                            ...prev,
                                            [item.key]: !isChecked,
                                        }))
                                    }
                                    className="mt-1 h-4 w-4 rounded border-gray-300 text-[#004aad] focus:ring-[#004aad] cursor-pointer"
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            <button
                onClick={handlePreference}
                type="button"
                className="w-full bg-[#004aad] hover:bg-[#003985] text-white font-semibold text-xs py-3 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
                {
                    isPending ? <Loader2 className="animate-spin" /> : <><Save size={14} /> <span>Save Preferences</span></>
                }
            </button>
        </div>

    )
}

export default TrackOptions

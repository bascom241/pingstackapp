import whatsapp from "../../../assets/whatsapp.png";
import gmail from "../../../assets/gmail.png";
import chat from "../../../assets/chat.png";
import { motion } from "framer-motion";
import { useState } from "react";
import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreateCampaignStore } from "../../../features/campaigns/store/createCampaignStore";

interface SelectCampaignProps {
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
}

const SelectCampaign = ({
    isOpen,
    setIsOpen,
}: SelectCampaignProps) => {
    const [selectedBox, setSelectedBox] = useState("email");
    const navigate = useNavigate();
    const { setSelectedCampaignType, setCurrentStep } = useCreateCampaignStore();

    const campaignTypes = [
        {
            id: "email",
            name: "Email Campaign",
            description:
                "Reach your audience with rich HTML emails and newsletters.",
            image: gmail,
            state: "active"
        },
        {
            id: "sms",
            name: "SMS Campaign",
            description:
                "Send direct, high-opening text messages right to mobile phones.",
            image: chat,
            state: "inactive"
        },
        {
            id: "whatsapp",
            name: "WhatsApp Campaign",
            description:
                "Interact with your customers through your WhatsApp channels.",
            image: whatsapp,
            state: "inactive"
        },
    ];

    if (!isOpen) return null;

    const selectedCampaignData = campaignTypes.find(c => c.id === selectedBox);
    const isCurrentActive = selectedCampaignData?.state === "active";

    const handleNextStep = () => {
        if (!isCurrentActive) return;

        setSelectedCampaignType(selectedBox as "email" | "sms" | "whatsapp");
        setCurrentStep(1);
        setIsOpen(false);
        navigate("/dashboard/campaigns/create");
    };

    return (
        <main>
            {/* Overlay */}
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-3 sm:p-5">

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="
                        w-full
                        max-w-2xl
                        max-h-[95vh]
                        sm:max-h-[90vh]
                        overflow-y-auto
                        bg-white
                        rounded-2xl
                        sm:rounded-3xl
                        border border-slate-100
                        p-4
                        sm:p-6
                        shadow-2xl
                    "
                >

                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 sm:mb-5">
                        <div>
                            <h1 className="font-bold text-lg sm:text-xl text-slate-800">
                                Create a campaign
                            </h1>

                            <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                Choose how you want to reach your audience.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="
                                flex-shrink-0
                                rounded-full
                                text-slate-400
                                hover:bg-[#004aad]
                                hover:text-white
                                transition-colors
                                duration-300
                                cursor-pointer
                            "
                        >
                            <XCircle size={23} />
                        </button>
                    </div>

                    {/* Body */}
                    <div
                        className="
                            w-full
                            bg-gradient-to-br
                            from-blue-50
                            to-sky-100/70
                            border
                            border-blue-100/50
                            rounded-xl
                            sm:rounded-2xl
                            p-3
                            sm:p-5
                        "
                    >

                        <p className="text-slate-600 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                            Select your preferred communication channel:
                        </p>

                        {/* Campaign Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">

                            {campaignTypes.map((cT) => {
                                const isSelected = selectedBox === cT.id;
                                const isActive = cT.state === "active";

                                return (
                                    <div
                                        key={cT.id}
                                        onClick={() => {
                                            if (isActive) {
                                                setSelectedBox(cT.id);
                                            }
                                        }}
                                        className={`
                                            group
                                            flex
                                            flex-row
                                            sm:flex-col
                                            gap-3
                                            sm:gap-3
                                            rounded-xl
                                            sm:rounded-2xl
                                            p-3
                                            sm:p-4
                                            border
                                            transition-all
                                            duration-300
                                            text-slate-800
                                            relative
                                            overflow-hidden

                                            ${
                                                !isActive
                                                    ? "opacity-60 bg-slate-100/50 border-slate-200/60 cursor-not-allowed"
                                                    : isSelected
                                                    ? "bg-white border-blue-500 shadow-[0_6px_18px_rgba(0,74,173,0.12)] cursor-pointer"
                                                    : "bg-white/50 border-white/70 hover:bg-white/80 hover:border-blue-200 shadow-sm cursor-pointer"
                                            }
                                        `}
                                    >
                                        {/* Optional Inactive/Coming Soon Badge */}
                                        {!isActive && (
                                            <span className="absolute top-2 right-2 text-[10px] font-semibold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                                                Soon
                                            </span>
                                        )}

                                        {/* Icon Container */}
                                        <div
                                            className="
                                                flex
                                                flex-shrink-0
                                                items-center
                                                justify-center
                                                bg-white/70
                                                rounded-lg
                                                sm:rounded-xl
                                                w-16
                                                h-16
                                                sm:w-full
                                                sm:h-24
                                                border
                                                border-white/60
                                            "
                                        >
                                            <img
                                                src={cT.image}
                                                alt={cT.name}
                                                className="
                                                    w-10
                                                    h-10
                                                    sm:w-14
                                                    sm:h-14
                                                    object-contain
                                                    drop-shadow-sm
                                                "
                                            />
                                        </div>

                                        {/* Text Content */}
                                        <div className="flex-1 min-w-0">

                                            {/* Title + Selection */}
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="font-bold text-sm sm:text-base text-slate-800 leading-tight">
                                                    {cT.name}
                                                </h3>

                                                {isActive && (
                                                    <span
                                                        className={`
                                                            flex-shrink-0
                                                            h-4
                                                            w-4
                                                            rounded-full
                                                            border
                                                            flex
                                                            items-center
                                                            justify-center
                                                            transition-all
                                                            ${
                                                                isSelected
                                                                    ? "bg-[#004aad] border-[#004aad]"
                                                                    : "border-slate-300 bg-white"
                                                            }
                                                        `}
                                                    >
                                                        {isSelected && (
                                                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                                        )}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Description */}
                                            <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed mt-1.5">
                                                {cT.description}
                                            </p>

                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 sm:mt-5 flex justify-end">
                        <button
                            type="button"
                            disabled={!isCurrentActive}
                            className={`
                                w-full
                                sm:w-auto
                                font-semibold
                                text-sm
                                py-2.5
                                sm:py-3
                                px-6
                                rounded-xl
                                transition-all
                                shadow-md
                                ${
                                    isCurrentActive
                                        ? "bg-[#004aad] hover:bg-blue-700 text-white active:scale-95 cursor-pointer"
                                        : "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                                }
                            `}
                            onClick={handleNextStep}
                        >
                            Next Step
                        </button>
                    </div>

                </motion.div>
            </div>
        </main>
    );
};

export default SelectCampaign;
import Input from "../Input"
import { motion } from "framer-motion"
import { X } from "lucide-react"

interface SenderIdModalProps {
    onClose?: () => void;
}

const SenderIdModal = ({ onClose }: SenderIdModalProps) => {
    return (
        <motion.section 
            className='bg-black/40 backdrop-blur-sm fixed inset-0 flex items-center justify-center w-full z-50 p-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div 
                className="bg-white rounded-2xl p-6 flex flex-col gap-5 items-center w-full max-w-md shadow-xl border border-gray-100"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: "spring", duration: 0.5 }}
            >
                {/* Header */}
                <div className="flex w-full items-center justify-between pb-3 border-b border-gray-100">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Create Your ID</h1>
                        <p className="text-xs text-gray-500 mt-0.5">Fill in the details to request your SMS sender ID.</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition-all duration-200"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Body */}
                <div className="w-full flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5 w-full">
                        <label className="text-xs font-semibold text-gray-700 tracking-wide uppercase">
                            Sender ID SMS
                        </label>
                        <Input
                            placeholder="e.g. Pingstack"
                            className="w-full"
                        />
                        <span className="text-[11px] text-gray-400">
                            Ensure your ID is not more than 11 characters.
                        </span>
                    </div>

                    <div className="flex flex-col gap-1.5 w-full">
                        <label className="text-xs font-semibold text-gray-700 tracking-wide uppercase">
                            Company
                        </label>
                        <Input
                            placeholder="e.g. Pingstack"
                            className="w-full"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 w-full">
                        <label className="text-xs font-semibold text-gray-700 tracking-wide uppercase">
                            Use Case
                        </label>
                        <Input
                            placeholder="e.g. Transactional alerts, OTPs"
                            className="w-full"
                        />
                    </div>
                </div>

                {/* Footer Action Button */}
                <button
                    type="submit"
                    className="w-full mt-2 bg-[#004aad] hover:bg-[#003985] text-white font-semibold text-sm py-3 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#004aad]/50"
                >
                    Save Sender ID
                </button>
            </motion.div>
        </motion.section>
    )
}

export default SenderIdModal
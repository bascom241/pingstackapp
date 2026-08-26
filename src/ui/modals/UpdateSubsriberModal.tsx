import { motion } from "framer-motion"
import React, { useEffect, useState } from "react"
import { useUpdateSubscriber } from "../../features/contacts/hooks/useSubsciber"
import { useQueryClient } from "@tanstack/react-query"
import { SUBSCIBERS_QUERY_KEY } from "../../features/contacts/hooks/useSubsciber"
import { useSnackbar } from "notistack"
import { AUDIENCE_QUERY_KEY } from "../../features/contacts/hooks/useAudience"
import { getApiErrorMessage } from "../../utils/apiError"
import { Loader2 } from "lucide-react"
import { useGetSingSubscriber } from "../../features/contacts/hooks/useSubsciber"


interface UpdateSubscriberModalProps {
    uploadModal: boolean
    setUploadModal: (v: boolean) => void
    listId: string
    subscriberId: string
}
const UpdateSubsriberModal = ({ uploadModal, setUploadModal, listId, subscriberId }: UpdateSubscriberModalProps) => {
    const {data,isPending:fetchingSingleSubscriber,error} = useGetSingSubscriber(subscriberId)
  
    const [formData, setFormData] = useState({ name: "", destinationNumber: "", status: "" });
    const { mutate, isPending, isError } = useUpdateSubscriber();



    
    const { enqueueSnackbar } = useSnackbar()
    const queryClient = useQueryClient();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            return {
                ...prev, [name]: value
            }
        })
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSend = { ...formData, listId, subscriberId };
        mutate(dataToSend, {
            onSuccess: (data) => {
                console.log(data);
                queryClient.invalidateQueries({
                    queryKey: SUBSCIBERS_QUERY_KEY,
                });
                queryClient.invalidateQueries({
                    queryKey: AUDIENCE_QUERY_KEY,
                });
                enqueueSnackbar("subcriber upldated", { variant: "success" });
                setUploadModal(false)
            },
            onError: (error) => {
                const errorMessage = getApiErrorMessage(error, "Something went wrong");
                enqueueSnackbar(errorMessage || "Failed to update", {
                    variant: "error",
                });
            }
        })

    }

    useEffect(()=> {
        if(data){
            setFormData({
                name:data.orderCreator, 
                destinationNumber: data.transactionNumber, 
                status: data.status
            })
        }
    }, [data])
    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xl max-w-sm w-full space-y-4"
            >
                <form className="space-y-3" onSubmit={handleSubmit} >
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Subscriber Name</label>
                        <input
                            type="text"
                            placeholder="e.g., Abdulbasit"
                            value={formData.name}
                            onChange={handleChange}
                            name="name"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#004aad]/10 focus:border-[#004aad] transition-all"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Subsciber PhoneNumber</label>
                        <input
                            type="number"
                            value={formData.destinationNumber}
                            onChange={handleChange}
                            name="destinationNumber"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#004aad]/10 focus:border-[#004aad] transition-all"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <select
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#004aad]/10 focus:border-[#004aad] transition-all"
                            value={formData.status}
                            name="status"
                            onChange={handleChange}
                        >

                            <option value="">Select Status</option>
                            <option value="SUBSCRIBED">Subscribed</option>
                            <option value="UNSUBSCRIBED">Unsubscribed</option>
                            <option value="BOUNCED">Bounced</option>
                        </select>

                    </div>
                    <div className="flex justify-end gap-1.5 pt-2">
                        <button
                            type="button"
                            onClick={()=> setUploadModal(false)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-50 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-[#004aad] hover:bg-[#003985] text-white px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer shadow-sm shadow-[#004aad]/10"
                        >
                            {
                                isPending ? <Loader2 className="animate-spin"/> : " Update Subcriber"
                            }
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>

    )
}

export default UpdateSubsriberModal

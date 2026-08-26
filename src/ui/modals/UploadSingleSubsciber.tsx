import { motion } from "framer-motion"
import React, { useState, type ChangeEvent, useEffect } from "react"
import { AUDIENCE_QUERY_KEY, useGetAllAudience } from "../../features/contacts/hooks/useAudience"
import { useCreateSubcriber } from "../../features/contacts/hooks/useSubsciber"
import { useQueryClient } from "@tanstack/react-query"
import { SUBSCIBERS_QUERY_KEY } from "../../features/contacts/hooks/useSubsciber"
import { useSnackbar } from "notistack"
import { getApiErrorMessage } from "../../utils/apiError"
interface UploadProps {
    setAdd: (v: boolean) => void
    selectedId: string
}
const UploadSingleSubsciber = ({ setAdd, selectedId }: UploadProps) => {

    const [formData, setFormData] = useState({ name: "", destinationNumber: "", });
    const [selectedSubsciber, setSelectedSubsciber] = useState<string>("")
    const { mutate, isPending: creatingSub, error: subError } = useCreateSubcriber()
    const { data, isPending, isError, error } = useGetAllAudience();
    const { enqueueSnackbar } = useSnackbar()
    const queryClient = useQueryClient();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            return {
                ...prev, [name]: value
            }
        })
    }

    const handleSelectedSubscriberToggler = (id: string) => {
        setSelectedSubsciber(id)
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const dataToSend = {
            ...formData, listId: selectedSubsciber
        };

        mutate(dataToSend, {
            onSuccess: (data) => {
                console.log(data);
                 queryClient.invalidateQueries({
                    queryKey: SUBSCIBERS_QUERY_KEY,
                });

                 queryClient.invalidateQueries({
                    queryKey: AUDIENCE_QUERY_KEY,
                });
                enqueueSnackbar("subcriber uploaded", { variant: "success" })
                setAdd(false)
            },
            onError: (error) => {
                const errorMessage = getApiErrorMessage(error, "Something went wrong");
                enqueueSnackbar(errorMessage || "Failed to create", {
                    variant: "error",
                });
            }
        })
    }




    useEffect(() => {
        if (data && data.length > 0 && !selectedSubsciber) {
            if (selectedId) {
                setSelectedSubsciber(selectedId)
            } else {
                setSelectedSubsciber(data[0].id);
            }

        }
    }, [data, selectedSubsciber, selectedId]);
    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xl max-w-sm w-full space-y-4"
            >


                <div className="w-full flex items-center gap-4 overflow-x-scroll">


                    {
                        data && data.length > 0 && data.map((d: any) => {
                            const isActive = selectedSubsciber === d.id
                            return (
                                <div onClick={() => handleSelectedSubscriberToggler(d.id)} className={`mb-2 p-1 rounded-xl  flex items-center justify-between group cursor-pointer  bg-[#004aad]/5 border border-[#004aad]/10 text-[#004aad] ${isActive
                                    ? "bg-[#004aad]/5 border border-[#004aad]/10 text-[#004aad]"
                                    : "bg-transparent border border-transparent text-gray-700 hover:bg-gray-50/80"
                                    } `}>
                                    <p className="text-[8px]">{d.name.toLowerCase()}</p>
                                </div>
                            )
                        })


                    }

                </div>


                <form className="space-y-3" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Subscriber Name</label>
                        <input
                            type="text"
                            required
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
                            required
                            placeholder="e.g., 08059139063"
                            value={formData.destinationNumber}
                            onChange={handleChange}
                            name="destinationNumber"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#004aad]/10 focus:border-[#004aad] transition-all"
                        />
                    </div>


                    <div className="flex justify-end gap-1.5 pt-2">
                        <button
                            type="button"
                            onClick={() => setAdd(false)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-50 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-[#004aad] hover:bg-[#003985] text-white px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer shadow-sm shadow-[#004aad]/10"
                        >
                            Add Subcriber
                        </button>
                    </div>

                </form>
            </motion.div>
        </div>
    )
}

export default UploadSingleSubsciber

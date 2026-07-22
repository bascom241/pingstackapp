import { motion } from "framer-motion";
import { X } from "lucide-react";
import FileUploader from "../../components/utils/FileUploader";
import { useSnackbar } from "notistack";
import { useGetSingleAudience } from "../../features/contacts/hooks/useAudience";
import { useEffect } from "react";

interface ModalState {
    setIsUploadModaOpen: (isOpen: boolean) => void;
    selectedId: string
}

const Upload = ({ setIsUploadModaOpen, selectedId }: ModalState) => {
    const { data, isPending } = useGetSingleAudience(selectedId);

    console.log(data)

    let name; 
    let id;
    if (data !== undefined) {
        name = data.name
        id = data.id 
    }
    // const {name} = data; 
    const { enqueueSnackbar } = useSnackbar();
    if (!selectedId) {
        return enqueueSnackbar("Audence not selected", { variant: "error" })
    }




    return (
        /* Backdrop overlay */
        <div className="fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                /* 1. Changed bg-transparent to solid bg-white / dark:bg-neutral-900 
                  2. Added relative positioning so the close button can anchor to it
                  3. Updated border and padding 
                */
                className="relative bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-2xl max-w-sm w-full space-y-4"
            >
                {/* Pinned Close Button: 
                  Positioned absolutely at the top right, with contrasting hover states 
                */}
                <button
                    type="button"
                    onClick={() => setIsUploadModaOpen(false)}
                    className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg transition-colors z-20 cursor-pointer"
                    aria-label="Close modal"
                >
                    <X className="w-4.5 h-4.5" />
                </button>

                {/* Main Content (With top padding so it doesn't overlap the close button) */}
                <div className="pt-2">
                    <FileUploader
                    audience ={name}
                    id= {id}
                    />
                </div>

            </motion.div>
        </div>
    );
};

export default Upload;
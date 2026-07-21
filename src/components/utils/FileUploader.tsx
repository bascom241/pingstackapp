import { useState, type ChangeEvent, type DragEvent } from "react";
import { UploadCloud, FileText, X } from "lucide-react";

type UploadStatus = "idle" | "uploading" | "success" | "fail";

const FileUploader = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragActive, setIsDragActive] = useState<boolean>(false);
    // Added a simulated upload function for demonstration
    const [status, setStatus] = useState<UploadStatus>("idle");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus("idle"); // Reset status on new file
        }
    };

    const handleDrag = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragActive(true);
        } else if (e.type === "dragleave") {
            setIsDragActive(false);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setStatus("idle"); // Reset status on new file
        }
    };

    const removeFile = () => {
        setFile(null);
        setStatus("idle");
    };

    // Simulated upload handler
    const handleUpload = () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        console.log(formData)
    };

    return (
        <div className="w-full flex flex-col gap-2">
            {/* Field Label */}
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Upload Subscribers List
            </label>

            {!file ? (
                /* Drag & Drop Zone */
                <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    /* Changed transparent backgrounds to solid colors: bg-gray-50, dark:bg-neutral-900, etc. */
                    className={`relative w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-all group cursor-pointer
                        ${isDragActive
                            ? "border-[#004aad] bg-blue-50 dark:bg-blue-950"
                            : "border-gray-300 dark:border-gray-700 hover:border-[#004aad] bg-gray-50 dark:bg-neutral-900"
                        }`}
                >
                    <input
                        type="file"
                        onChange={handleChange}
                        accept=".pdf,.png,.jpg,.jpeg" // Good practice to add accept attribute
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />

                    {/* Icon Container - Solid backgrounds */}
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full text-[#004aad] dark:text-blue-400 group-hover:scale-105 transition-transform duration-200">
                        <UploadCloud className="w-6 h-6" />
                    </div>

                    <div className="text-center">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            PDF, PNG, or JPG (max. 10MB)
                        </p>
                    </div>
                </div>
            ) : (
                /* Selected File State Preview */
                /* Changed transparent backgrounds to solid colors: bg-gray-100, dark:bg-neutral-800 */
                <div className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-neutral-800 rounded-xl">
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Solid backgrounds for icon */}
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 text-[#004aad] dark:text-blue-400 rounded-lg shrink-0">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                                {file.name}
                            </span>
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={removeFile}
                        disabled={status === "uploading"}
                        className="p-1.5 hover:bg-gray-200 dark:hover:bg-neutral-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors disabled:opacity-50"
                        aria-label="Remove file"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Helper text for upload status */}
            {status === "success" && <p className="text-xs text-green-600 dark:text-green-400 font-medium px-1">File uploaded successfully.</p>}
            {status === "fail" && <p className="text-xs text-red-600 dark:text-red-400 font-medium px-1">Upload failed. Please try again.</p>}

            {/* Upload Button */}
            {
                file && status !== "success" &&
                <button
                    type="button" // Change to "submit" if inside a form
                    onClick={handleUpload}
                    disabled={status === "uploading"}
                    className="w-full mt-2 bg-[#004aad] hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold text-sm py-3.5 px-4 rounded-xl transition-all shadow-sm shadow-blue-900/10 flex items-center justify-center gap-2 group cursor-pointer disabled:cursor-not-allowed"
                >
                    {status === "uploading" ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Uploading...</span>
                        </>
                    ) : (
                        <span>Upload List</span>
                    )}
                </button>
            }
        </div>
    );
};

export default FileUploader;
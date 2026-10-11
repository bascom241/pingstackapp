import EmailEditor from "react-email-editor";
import { useRef, useState, useEffect } from "react";
import {
    ArrowLeft,
    Check,
    Loader2,
    Mail,
    Save,
    AlertCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";



import { useGetSingleTemplate,  useUpdateTemplate, } from "../../features/templates/hooks/useTemplate";
const EmailTemplateEditor = () => {
    const navigate = useNavigate();
    const { templateId } = useParams<{ templateId: string }>();
console.log("Template ID:", templateId);
    const emailEditorRef = useRef<any>(null);

    const [isReady, setIsReady] = useState(false);
    const [saved, setSaved] = useState(false);
    const [saveError, setSaveError] = useState("");

    /*
     * Get the current template/version
     */
    const {
        data: initialData,
        isLoading,
        isError,
        error,
    } = useGetSingleTemplate(templateId ?? "");

    /*
     * Update template version
     */
    const updateTemplateMutation = useUpdateTemplate();

    /**
     * Unlayer is ready
     */
    const onReady = () => {
        setIsReady(true);
    };

    /**
     * Load existing Unlayer design
     */
    useEffect(() => {
        if (
            !isReady ||
            !emailEditorRef.current?.editor ||
            !initialData?.designJson
        ) {
            return;
        }

        try {
            const design =
                typeof initialData.designJson === "string"
                    ? JSON.parse(initialData.designJson)
                    : initialData.designJson;

            console.log("Loading email design:", design);

            emailEditorRef.current.editor.loadDesign(design);
        } catch (error) {
            console.error("Failed to load email design:", error);
            setSaveError("We couldn't load the email design.");
        }
    }, [isReady, initialData]);

    /**
     * Save email
     */
    const handleSave = () => {
        if (!templateId) {
            setSaveError("Template ID is missing.");
            return;
        }

        if (!emailEditorRef.current?.editor) {
            setSaveError("The email editor is not ready yet.");
            return;
        }

        if (!initialData) {
            setSaveError("Template information is not available.");
            return;
        }

        setSaveError("");
        setSaved(false);

        emailEditorRef.current.editor.exportHtml((data: any) => {
            const { design, html } = data;

            const payload = {
                designJson: JSON.stringify(design),
                htmlContent: html,
                subject: initialData.subject ?? "",
            };

            updateTemplateMutation.mutate(
                {
                    templateId,
                    data: payload,
                },
                {
                    onSuccess: () => {
                        setSaved(true);

                        setTimeout(() => {
                            setSaved(false);
                        }, 2500);
                    },

                    onError: (error: any) => {
                        console.error(
                            "Failed to save email template:",
                            error
                        );

                        const message =
                            error?.response?.data?.message ||
                            error?.message ||
                            "Failed to save the email template.";

                        setSaveError(message);
                    },
                }
            );
        });
    };

    /**
     * Loading
     */
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f7f8fa] px-4">
                <div className="flex flex-col items-center gap-3 text-center">
                    <Loader2
                        size={28}
                        className="animate-spin text-[#004aad]"
                    />

                    <p className="text-sm font-medium text-gray-600">
                        Loading email template...
                    </p>
                </div>
            </div>
        );
    }

    /**
     * Error
     */
    if (isError || !initialData) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f7f8fa] px-4">
                <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                        <AlertCircle
                            size={22}
                            className="text-red-500"
                        />
                    </div>

                    <h2 className="mt-4 text-base font-bold text-gray-900">
                        Unable to load template
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        {(
                            error as any
                        )?.response?.data?.message ||
                            "We couldn't load this email template."}
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="
                            mt-5
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-[#004aad]
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:bg-[#003985]
                        "
                    >
                        <ArrowLeft size={16} />
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    const isSaving = updateTemplateMutation.isPending;

    return (
        <div className="min-h-screen bg-[#f7f8fa]">
            {/* =========================================================
                HEADER
            ========================================================= */}
            <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
                <div className="w-full px-3 sm:px-5 lg:px-8">
                    <div className="flex min-h-[64px] items-center justify-between gap-3 sm:min-h-[68px]">
                        {/* LEFT */}
                        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                disabled={isSaving}
                                className="
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    border-gray-200
                                    bg-white
                                    text-gray-600
                                    transition
                                    hover:bg-gray-50
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                                aria-label="Go back"
                            >
                                <ArrowLeft size={17} />
                            </button>

                            <div className="flex min-w-0 items-center gap-3">
                                <div
                                    className="
                                        hidden
                                        h-9
                                        w-9
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-blue-50
                                        text-[#004aad]
                                        sm:flex
                                    "
                                >
                                    <Mail size={17} />
                                </div>

                                <div className="min-w-0">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <h1 className="max-w-[180px] truncate text-sm font-bold text-gray-900 sm:max-w-[300px] sm:text-base">
                                            {initialData?.name ||
                                                "Email Template"}
                                        </h1>

                                        <span className="hidden shrink-0 rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500 sm:inline-flex">
                                            {initialData?.status ||
                                                "DRAFT"}
                                        </span>
                                    </div>

                                    <p className="mt-0.5 hidden max-w-[400px] truncate text-xs text-gray-400 sm:block">
                                        Create and customize your email
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="flex shrink-0 items-center gap-2">
                            {/* SAVED */}
                            {saved && (
                                <div className="hidden items-center gap-1.5 text-xs font-medium text-emerald-600 sm:flex">
                                    <Check size={14} />
                                    Saved
                                </div>
                            )}

                            {/* ERROR */}
                            {saveError && (
                                <div className="hidden max-w-[250px] truncate items-center gap-1.5 text-xs font-medium text-red-500 lg:flex">
                                    <AlertCircle size={14} />
                                    {saveError}
                                </div>
                            )}

                            {/* SAVE */}
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={!isReady || isSaving}
                                className="
                                    inline-flex
                                    h-10
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-[#004aad]
                                    px-3.5
                                    text-xs
                                    font-semibold
                                    text-white
                                    shadow-sm
                                    transition
                                    hover:bg-[#003985]
                                    disabled:cursor-not-allowed
                                    disabled:bg-gray-300
                                    sm:px-4
                                    sm:text-sm
                                "
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2
                                            size={15}
                                            className="animate-spin"
                                        />

                                        <span className="hidden sm:inline">
                                            Saving...
                                        </span>

                                        <span className="sm:hidden">
                                            Saving
                                        </span>
                                    </>
                                ) : saved ? (
                                    <>
                                        <Check size={15} />
                                        <span className="hidden sm:inline">
                                            Saved
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={15} />

                                        <span className="hidden sm:inline">
                                            Save email
                                        </span>

                                        <span className="sm:hidden">
                                            Save
                                        </span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* =========================================================
                MAIN
            ========================================================= */}
            <main className="w-full px-2.5 py-3 sm:px-5 sm:py-6 lg:px-8">
                <div className="mx-auto w-full max-w-[1600px]">
                    {/* =================================================
                        TEMPLATE INFORMATION
                    ================================================= */}
                    <div className="mb-3 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm sm:mb-4 sm:rounded-2xl">
                        <div className="px-3.5 py-3.5 sm:px-5 sm:py-4">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2 lg:gap-8">
                                {/* SUBJECT */}
                                <div className="min-w-0">
                                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-gray-400 sm:text-[11px]">
                                        Email subject
                                    </label>

                                    <div className="break-words text-sm font-semibold text-gray-800 sm:text-base">
                                        {initialData?.subject ||
                                            "Untitled email"}
                                    </div>
                                </div>

                                {/* DESCRIPTION */}
                                {initialData?.description && (
                                    <div className="min-w-0">
                                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-gray-400 sm:text-[11px]">
                                            Purpose
                                        </label>

                                        <div className="break-words text-xs leading-5 text-gray-500 sm:text-sm">
                                            {initialData.description}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* =================================================
                        ERROR MOBILE
                    ================================================= */}
                    {saveError && (
                        <div className="mb-3 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-3.5 py-3 text-xs text-red-600 lg:hidden">
                            <AlertCircle
                                size={15}
                                className="mt-0.5 shrink-0"
                            />

                            <span>{saveError}</span>
                        </div>
                    )}

                    {/* =================================================
                        EDITOR
                    ================================================= */}
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm sm:rounded-2xl">
                        {/* EDITOR HEADER */}
                        <div className="flex h-11 items-center justify-between border-b border-gray-100 bg-white px-3.5 sm:h-12 sm:px-5">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-emerald-500" />

                                <span className="text-xs font-semibold text-gray-700">
                                    Email editor
                                </span>
                            </div>

                            {!isReady && (
                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 sm:text-[11px]">
                                    <Loader2
                                        size={13}
                                        className="animate-spin"
                                    />

                                    <span>Loading editor...</span>
                                </div>
                            )}

                            {isReady && (
                                <span className="hidden text-[11px] text-gray-400 sm:block">
                                    Click Save email when finished
                                </span>
                            )}
                        </div>

                        {/* UNLAYER */}
                        <div className="w-full bg-[#f8f9fb] p-0 sm:p-2 lg:p-3">
                            <div className="w-full overflow-hidden bg-white sm:rounded-xl sm:border sm:border-gray-200">
                                <EmailEditor
                                    ref={emailEditorRef}
                                    onReady={onReady}
                                    minHeight="720px"
                                    style={{
                                        width: "100%",
                                        minHeight: "720px",
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* =================================================
                        FOOTER
                    ================================================= */}
                    <div className="mt-3 flex flex-col gap-1 px-1 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-[10px] leading-4 text-gray-400 sm:text-[11px]">
                            Design your email and save when you're finished.
                        </p>

                        <p className="text-[10px] leading-4 text-gray-400 sm:text-[11px]">
                            Changes are saved when you click Save.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EmailTemplateEditor;
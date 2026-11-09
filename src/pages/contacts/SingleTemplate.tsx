import { PageSkeleton } from "../../ui/Skeleton";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Code2,
    Copy,
    Edit3,
    FileJson,
    Inbox,
    Mail,
    Menu,
    MoreVertical,
    RefreshCw,
    Search,
    Send,
    Settings,
    Star,
    Tag,
    Trash2,
} from "../../ui/icons";

import { useGetSingleTemplate } from "../../features/templates/hooks/useTemplate";

interface EmailTemplateData {
    templateId: string;
    templateVersionId: string;
    version: number;
    subject: string;
    htmlContent: string;
    designJson: string | null;
    createdAt: string;

    // Optional metadata if your backend eventually returns them
    name?: string;
    slug?: string;
    description?: string;
    category?: string;
    status?: string;
    updatedAt?: string;
}

const getEmailSnippet = (html: string) => {
    if (!html) {
        return "No email content";
    }

    const text = html
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&#39;/gi, "'")
        .replace(/&quot;/gi, '"')
        .replace(/\s+/g, " ")
        .trim();

    if (!text) {
        return "No email content";
    }

    return text.length > 120
        ? `${text.substring(0, 120)}...`
        : text;
};

const formatDate = (date: string) => {
    if (!date) {
        return "Not available";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return date;
    }

    return parsedDate.toLocaleString();
};

const formatShortDate = (date: string) => {
    if (!date) {
        return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "";
    }

    return parsedDate.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
    });
};

const SingleTemplate = () => {
    const navigate = useNavigate();

    const { templateId } = useParams<{
        templateId: string;
    }>();

    const {
        data,
        isPending,
        isError,
        refetch,
    } = useGetSingleTemplate(templateId ?? "");

    /**
     * ---------------------------------------------------------
     * PANEL STATE
     * ---------------------------------------------------------
     *
     * Remember the user's preference.
     *
     * true  = information panel visible
     * false = information panel collapsed
     */
    const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(() => {
        if (typeof window === "undefined") {
            return false;
        }

        const savedState =
            localStorage.getItem(
                "email-template-info-panel"
            );

        return savedState !== "collapsed";
    });

    /**
     * Save panel preference.
     */
    useEffect(() => {
        localStorage.setItem(
            "email-template-info-panel",
            isInfoPanelOpen ? "expanded" : "collapsed"
        );
    }, [isInfoPanelOpen]);

    const template =
        data as EmailTemplateData | undefined;

    console.log(
        "Single Template Data:",
        template
    );

    /**
     * ---------------------------------------------------------
     * LOADING
     * ---------------------------------------------------------
     */
    if (isPending) {
        return <PageSkeleton layout="detail" label="Loading email template" />;
    }

    /**
     * ---------------------------------------------------------
     * ERROR
     * ---------------------------------------------------------
     */
    if (isError || !template) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f7f8fa] px-5">
                <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                        <Mail
                            size={21}
                            className="text-red-500"
                        />
                    </div>

                    <h2 className="mt-4 text-lg font-bold text-gray-900">
                        Unable to load template
                    </h2>

                    <p className="mt-2 text-base leading-relaxed text-gray-500">
                        We couldn't retrieve this email
                        template. Please try again.
                    </p>

                    <div className="mt-6 flex justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-base font-semibold text-gray-700 transition hover:bg-gray-50"
                        >
                            <ArrowLeft size={16} />
                            Go back
                        </button>

                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#004aad] px-4 py-3.5 text-base font-semibold text-white transition hover:bg-[#003985]"
                        >
                            <RefreshCw size={16} />
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const emailSnippet = getEmailSnippet(
        template.htmlContent
    );

    const createdDate = formatDate(
        template.createdAt
    );

    const shortDate = formatShortDate(
        template.createdAt
    );

    /**
     * ---------------------------------------------------------
     * ACTIONS
     * ---------------------------------------------------------
     */

    const handleEdit = () => {
        navigate(
            `/dashboard/email-templates/${template.templateId}/edit`
        );
    };

    const handleCopyTemplateId = async () => {
        try {
            await navigator.clipboard.writeText(
                template.templateId
            );
        } catch (error) {
            console.error(
                "Failed to copy template ID:",
                error
            );
        }
    };

    const toggleInfoPanel = () => {
        setIsInfoPanelOpen(
            (previous) => !previous
        );
    };

    return (
        <div className="min-h-screen bg-[#f7f8fa]">
            {/* =====================================================
                TOP HEADER
            ====================================================== */}

            <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
                <div className="flex h-[68px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
                    {/* LEFT */}
                    <div className="flex min-w-0 items-center gap-3">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                            title="Go back"
                        >
                            <ArrowLeft size={18} />
                        </button>

                        <div className="hidden h-6 w-px bg-gray-200 sm:block" />

                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                                Email template
                            </p>

                            <h1 className="truncate text-lg font-bold text-gray-900 sm:text-xl">
                                {template.subject ||
                                    "Untitled email"}
                            </h1>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex shrink-0 items-center gap-2">
                        {/* Edit */}
                        <button
                            type="button"
                            onClick={handleEdit}
                            className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#004aad] px-3.5 text-sm font-semibold text-white transition hover:bg-[#003985] sm:text-base"
                        >
                            <Edit3 size={15} />
                            <span className="hidden sm:inline">
                                Edit template
                            </span>
                            <span className="sm:hidden">
                                Edit
                            </span>
                        </button>

                        {/* Collapse / Expand */}
                        <button
                            type="button"
                            onClick={toggleInfoPanel}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                            title={
                                isInfoPanelOpen
                                    ? "Hide template information"
                                    : "Show template information"
                            }
                            aria-label={
                                isInfoPanelOpen
                                    ? "Hide template information"
                                    : "Show template information"
                            }
                        >
                            {isInfoPanelOpen ? (
                                <ChevronLeft
                                    size={18}
                                />
                            ) : (
                                <ChevronRight
                                    size={18}
                                />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* =====================================================
                MAIN LAYOUT
            ====================================================== */}

            <main
                className={`
                    grid
                    min-h-[calc(100vh-68px)]
                    transition-all
                    duration-300
                    ease-in-out

                    ${
                        isInfoPanelOpen
                            ? "lg:grid-cols-[340px_minmax(0,1fr)]"
                            : "grid-cols-1"
                    }
                `}
            >
                {/* =================================================
                    TEMPLATE INFORMATION PANEL
                ================================================== */}

                {isInfoPanelOpen && (
                    <aside
                        className="
                            border-b
                            border-gray-200
                            bg-white

                            lg:border-b-0
                            lg:border-r
                            lg:border-gray-200
                        "
                    >
                        <div className="sticky top-[68px] max-h-[calc(100vh-68px)] overflow-y-auto">
                            <div className="p-5 sm:p-6">
                                {/* Panel heading */}
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                                        <Mail
                                            size={18}
                                            className="text-[#004aad]"
                                        />
                                    </div>

                                    <div>
                                        <h2 className="text-base font-bold text-gray-900">
                                            Template details
                                        </h2>

                                        <p className="mt-0.5 text-sm text-gray-500">
                                            Information about this
                                            email
                                        </p>
                                    </div>
                                </div>

                                {/* Subject */}
                                <div className="mb-6">
                                    <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
                                        Subject
                                    </p>

                                    <p className="text-base font-semibold leading-relaxed text-gray-900">
                                        {template.subject ||
                                            "No subject"}
                                    </p>
                                </div>

                                {/* Description */}
                                {template.description && (
                                    <div className="mb-6">
                                        <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
                                            Description
                                        </p>

                                        <p className="text-sm leading-relaxed text-gray-500">
                                            {
                                                template.description
                                            }
                                        </p>
                                    </div>
                                )}

                                {/* Details */}
                                <div className="overflow-hidden rounded-xl border border-gray-200">
                                    {/* Version */}
                                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5">
                                        <div className="flex items-center gap-2.5">
                                            <FileJson
                                                size={15}
                                                className="text-gray-500"
                                            />

                                            <span className="text-sm font-medium text-gray-600">
                                                Version
                                            </span>
                                        </div>

                                        <span className="rounded-md bg-blue-50 px-2 py-1 text-sm font-bold text-[#004aad]">
                                            v
                                            {
                                                template.version
                                            }
                                        </span>
                                    </div>

                                    {/* Category */}
                                    {template.category && (
                                        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5">
                                            <div className="flex items-center gap-2.5">
                                                <Tag
                                                    size={
                                                        15
                                                    }
                                                    className="text-gray-500"
                                                />

                                                <span className="text-sm font-medium text-gray-600">
                                                    Category
                                                </span>
                                            </div>

                                            <span className="text-sm font-semibold text-gray-700">
                                                {
                                                    template.category
                                                }
                                            </span>
                                        </div>
                                    )}

                                    {/* Status */}
                                    {template.status && (
                                        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5">
                                            <div className="flex items-center gap-2.5">
                                                <span
                                                    className={`h-2 w-2 rounded-full ${
                                                        template.status ===
                                                        "PUBLISHED"
                                                            ? "bg-green-500"
                                                            : "bg-yellow-400"
                                                    }`}
                                                />

                                                <span className="text-sm font-medium text-gray-600">
                                                    Status
                                                </span>
                                            </div>

                                            <span className="text-sm font-semibold text-gray-700">
                                                {
                                                    template.status
                                                }
                                            </span>
                                        </div>
                                    )}

                                    {/* Created */}
                                    <div className="border-b border-gray-100 px-4 py-3.5">
                                        <div className="flex items-center gap-2.5">
                                            <Calendar
                                                size={15}
                                                className="text-gray-500"
                                            />

                                            <span className="text-sm font-medium text-gray-600">
                                                Created
                                            </span>
                                        </div>

                                        <p className="mt-1.5 pl-6 text-sm text-gray-500">
                                            {createdDate}
                                        </p>
                                    </div>

                                    {/* Template ID */}
                                    <div className="px-4 py-3.5">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex min-w-0 items-center gap-2.5">
                                                <Code2
                                                    size={
                                                        15
                                                    }
                                                    className="shrink-0 text-gray-500"
                                                />

                                                <span className="text-sm font-medium text-gray-600">
                                                    Template ID
                                                </span>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={
                                                    handleCopyTemplateId
                                                }
                                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                                                title="Copy template ID"
                                            >
                                                <Copy
                                                    size={
                                                        13
                                                    }
                                                />
                                            </button>
                                        </div>

                                        <p className="mt-1.5 break-all pl-6 font-mono text-xs leading-relaxed text-gray-500">
                                            {
                                                template.templateId
                                            }
                                        </p>
                                    </div>
                                </div>

                                {/* Version ID */}
                                <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                                    <div className="flex items-center gap-2">
                                        <FileJson
                                            size={14}
                                            className="text-gray-500"
                                        />

                                        <span className="text-xs font-bold uppercase tracking-[0.1em] text-gray-500">
                                            Version ID
                                        </span>
                                    </div>

                                    <p className="mt-2 break-all font-mono text-xs leading-relaxed text-gray-500">
                                        {
                                            template.templateVersionId
                                        }
                                    </p>
                                </div>

                                {/* Collapse button */}
                                <button
                                    type="button"
                                    onClick={
                                        toggleInfoPanel
                                    }
                                    className="mt-6 hidden w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 lg:flex"
                                >
                                    <ChevronLeft
                                        size={15}
                                    />

                                    Hide template details
                                </button>
                            </div>
                        </div>
                    </aside>
                )}

                {/* =================================================
                    GMAIL PREVIEW AREA
                ================================================== */}

                <section className="min-w-0 overflow-hidden bg-[#f6f8fc]">
                    {/* Gmail toolbar */}
                    <div className="border-b border-gray-200 bg-white">
                        <div className="flex h-[64px] items-center gap-3 px-4 sm:px-6 lg:px-8">
                            {/* Menu */}
                            <button
                                type="button"
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100"
                            >
                                <Menu size={19} />
                            </button>

                            {/* Gmail icon */}
                            <div className="hidden items-center gap-2 sm:flex">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
                                    <Mail
                                        size={17}
                                        className="text-red-500"
                                    />
                                </div>

                                <span className="text-base font-semibold text-gray-700">
                                    Mail
                                </span>
                            </div>

                            {/* Search */}
                            <div className="mx-auto flex w-full max-w-[620px] items-center">
                                <div className="flex h-10 w-full items-center gap-3 rounded-full bg-[#f1f3f4] px-4">
                                    <Search
                                        size={17}
                                        className="shrink-0 text-gray-500"
                                    />

                                    <span className="truncate text-sm text-gray-500">
                                        Search mail
                                    </span>
                                </div>
                            </div>

                            {/* Toolbar right */}
                            <div className="hidden items-center gap-1 md:flex">
                                <button
                                    type="button"
                                    className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100"
                                >
                                    <Settings
                                        size={17}
                                    />
                                </button>

                                <button
                                    type="button"
                                    className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100"
                                >
                                    <MoreVertical
                                        size={17}
                                    />
                                </button>

                                <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#004aad] text-sm font-bold text-white">
                                    U
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* =================================================
                        GMAIL BODY
                    ================================================== */}

                    <div className="flex min-h-[calc(100vh-132px)]">
                        {/* Gmail sidebar */}
                        <div className="hidden w-[220px] shrink-0 border-r border-gray-200 bg-[#f6f8fc] py-4 lg:block">
                            <div className="px-3">
                                <button
                                    type="button"
                                    className="mb-4 flex h-11 w-[120px] items-center justify-center gap-2 rounded-2xl bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm"
                                >
                                    <Mail
                                        size={16}
                                    />
                                    Compose
                                </button>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-3 rounded-r-full bg-[#d3e3fd] px-4 py-3.5 text-sm font-bold text-[#174ea6]">
                                        <Inbox
                                            size={16}
                                        />
                                        Inbox
                                        <span className="ml-auto text-xs">
                                            1
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 rounded-r-full px-4 py-3.5 text-sm text-gray-600">
                                        <Star
                                            size={16}
                                        />
                                        Starred
                                    </div>

                                    <div className="flex items-center gap-3 rounded-r-full px-4 py-3.5 text-sm text-gray-600">
                                        <Send
                                            size={16}
                                        />
                                        Sent
                                    </div>

                                    <div className="flex items-center gap-3 rounded-r-full px-4 py-3.5 text-sm text-gray-600">
                                        <Trash2
                                            size={16}
                                        />
                                        Trash
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* =================================================
                            EMAIL CONTENT
                        ================================================== */}

                        <div className="min-w-0 flex-1 overflow-hidden">
                            {/* Inbox row */}
                            <div className="border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100"
                                    >
                                        <ArrowLeft
                                            size={17}
                                        />
                                    </button>

                                    <div className="h-5 w-px bg-gray-200" />

                                    <button
                                        type="button"
                                        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100"
                                    >
                                        <Trash2
                                            size={16}
                                        />
                                    </button>

                                    <button
                                        type="button"
                                        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100"
                                    >
                                        <Mail
                                            size={16}
                                        />
                                    </button>

                                    <button
                                        type="button"
                                        className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100"
                                    >
                                        <MoreVertical
                                            size={17}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="px-3 py-5 sm:px-5 md:px-8 lg:px-10 xl:px-12">
                                {/* Email header */}
                                <div className="mx-auto w-full max-w-[1000px]">
                                    <div className="rounded-t-xl border border-b-0 border-gray-200 bg-white px-5 py-5 sm:px-7">
                                        <div className="flex items-start gap-3">
                                            {/* Avatar */}
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#004aad] text-base font-bold text-white">
                                                P
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <p className="truncate text-base font-bold text-gray-900">
                                                                Pingstack
                                                            </p>

                                                            <span className="truncate text-sm text-gray-500">
                                                                &lt;no-reply@pingstack.com&gt;
                                                            </span>
                                                        </div>

                                                        <p className="mt-0.5 text-sm text-gray-500">
                                                            to me
                                                        </p>
                                                    </div>

                                                    <div className="flex shrink-0 items-center gap-2">
                                                        <span className="text-xs text-gray-500">
                                                            {
                                                                shortDate
                                                            }
                                                        </span>

                                                        <button
                                                            type="button"
                                                            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100"
                                                        >
                                                            <Star
                                                                size={
                                                                    15
                                                                }
                                                            />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100"
                                                        >
                                                            <MoreVertical
                                                                size={
                                                                    15
                                                                }
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Subject */}
                                        <h2 className="mt-5 text-xl font-semibold leading-tight text-gray-900 sm:text-2xl">
                                            {template.subject ||
                                                "No subject"}
                                        </h2>

                                        {/* Snippet */}
                                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
                                            {emailSnippet}
                                        </p>
                                    </div>

                                    {/* =================================================
                                        ACTUAL EMAIL
                                    ================================================== */}

                                    <div className="overflow-hidden rounded-b-xl border border-gray-200 bg-white shadow-sm">
                                        <iframe
                                            title="Email content preview"
                                            srcDoc={
                                                template.htmlContent
                                            }
                                            className="block min-h-[700px] w-full border-0"
                                            sandbox=""
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* =====================================================
                FLOATING EXPAND BUTTON
                Only appears when information panel is collapsed.
            ====================================================== */}

            {!isInfoPanelOpen && (
                <button
                    type="button"
                    onClick={toggleInfoPanel}
                    className="
                        fixed
                        bottom-6
                        left-5
                        z-40
                        flex
                        h-11
                        items-center
                        gap-2
                        rounded-full
                        border
                        border-gray-200
                        bg-white
                        px-4
                        text-sm
                        font-semibold
                        text-gray-700
                        shadow-lg
                        transition
                        hover:bg-gray-50
                        hover:shadow-xl
                    "
                    title="Show template information"
                >
                    <ChevronRight size={16} />

                    <span className="hidden sm:inline">
                        Template details
                    </span>
                </button>
            )}
        </div>
    );
};

export default SingleTemplate;
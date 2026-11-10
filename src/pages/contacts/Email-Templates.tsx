import { DataSkeleton } from "../../ui/Skeleton";
import MessagingHeader from '../../components/messaging/MessagingHeader';
import { useState } from "react";
import {
    Plus,
    Search,
    Eye,
    Edit2,
    Mail,
    MoreHorizontal,
    Clock3,
} from "../../ui/icons";
import { useNavigate } from "react-router-dom";
import {EMPTY_EMAIL_HTML, EMPTY_EMAIL_DESIGN} from "../../utils/templates/EmptyEmailDesign"
import {
    useGetTemplateForUser,
    useCreateTemplate,
} from "../../features/templates/hooks/useTemplate";

import CreateEmailTemplateModal from "../../ui/modals/CreateTemplateModal"
import { getApiErrorMessage } from "../../utils/apiError";


type Template = {
    templateId: string;
    name: string;
    category: "TRANSACTIONAL" | "MARKETING" | "LIFECYCLE";
    description: string;
    slug: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    currentVersion: number;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
};

const categoryLabels = {
    TRANSACTIONAL: "Transactional",
    MARKETING: "Marketing",
    LIFECYCLE: "Lifecycle",
};

const categoryStyles = {
    TRANSACTIONAL: "bg-blue-50 text-blue-700 border-blue-100",
    MARKETING: "bg-amber-50 text-amber-700 border-amber-100",
    LIFECYCLE: "bg-purple-50 text-purple-700 border-purple-100",
};

const statusStyles = {
    DRAFT: "bg-gray-100 text-gray-600",
    PUBLISHED: "bg-emerald-50 text-emerald-700",
    ARCHIVED: "bg-red-50 text-red-600",
};

const statusLabels = {
    DRAFT: "Draft",
    PUBLISHED: "Published",
    ARCHIVED: "Archived",
};

function formatDate(date: string) {
    if (!date) return "";

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
}

export default function EmailTemplates() {
    const [search, setSearch] = useState("");

    const [activeTab, setActiveTab] = useState<
        "all" | "TRANSACTIONAL" | "MARKETING" | "LIFECYCLE"
    >("all");

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const navigate = useNavigate();

    const {
        data: templates = [],
        isLoading,
    } = useGetTemplateForUser() as {
        data: Template[] | undefined;
        isLoading: boolean;
    };

    const createTemplateMutation = useCreateTemplate();

    const filtered = templates.filter((template) => {
        const matchesCategory =
            activeTab === "all" || template.category === activeTab;

        const searchValue = search.toLowerCase().trim();

        const matchesSearch =
            !searchValue ||
            template.name?.toLowerCase().includes(searchValue) ||
            template.description?.toLowerCase().includes(searchValue);

        return matchesCategory && matchesSearch;
    });

    /*
     * Open create modal
     */
    const handleCreateTemplate = () => {
        setIsCreateModalOpen(true);
    };

    /*
     * Create template
     *
     * We create the template as a DRAFT first.
     * After successful creation, we take the user
     * directly to the visual email editor.
     */
   const handleCreate = (data: {
    name: string;
    slug: string;
    category: "TRANSACTIONAL" | "MARKETING" | "LIFECYCLE";
    description: string;
    subject: string;
}) => {
    const payload = {
        name: data.name,
        slug: data.slug,
        category: data.category,
        description: data.description,
        status: "DRAFT" as const,

        version: {
            subject: data.subject,
            htmlContent: EMPTY_EMAIL_HTML,
            designJson: JSON.stringify(EMPTY_EMAIL_DESIGN),
        },
    };

    createTemplateMutation.mutate(payload, {
        onSuccess: (createdTemplate) => {
            setIsCreateModalOpen(false);

            navigate(
                `/dashboard/email-templates/${createdTemplate.templateId}/edit`
            );
        },

        onError: (error) => {
            console.error("Error creating template:", error);

            getApiErrorMessage(
                error,
                "Failed to create template"
            );
        },
    });
};

    const handleEditTemplate = (templateId: string) => {
        navigate(`/dashboard/email-templates/${templateId}/edit`);
    };

    const handlePreviewTemplate = (templateId: string) => {
        navigate(`/dashboard/email-templates/${templateId}`);
    };

    return (
        <>
            <div className="messaging-page py-2 sm:py-4">

                <MessagingHeader eyebrow="Design your message" title="Email templates" description="A home for your best emails. Build reusable designs that feel like your brand." action={<button type="button" className="messaging-primary" onClick={handleCreateTemplate}><Plus size={20} /> Create template</button>} />

                {/* Toolbar */}
                <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

                        {/* Categories */}
                        <div className="flex items-center gap-1 overflow-x-auto rounded-xl bg-gray-50 p-1">

                            {[
                                {
                                    value: "all",
                                    label: "All emails",
                                },
                                {
                                    value: "TRANSACTIONAL",
                                    label: "Transactional",
                                },
                                {
                                    value: "MARKETING",
                                    label: "Marketing",
                                },
                                {
                                    value: "LIFECYCLE",
                                    label: "Lifecycle",
                                },
                            ].map((tab) => (
                                <button
                                    key={tab.value}
                                    type="button"
                                    onClick={() =>
                                        setActiveTab(
                                            tab.value as
                                                | "all"
                                                | "TRANSACTIONAL"
                                                | "MARKETING"
                                                | "LIFECYCLE"
                                        )
                                    }
                                    className={`
                                        whitespace-nowrap
                                        rounded-lg
                                        px-3
                                        py-2
                                        text-sm
                                        font-semibold
                                        transition-all
                                        ${
                                            activeTab === tab.value
                                                ? "bg-white text-[#004aad] shadow-sm"
                                                : "text-gray-500 hover:text-gray-800"
                                        }
                                    `}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative w-full lg:w-64">
                            <Search
                                size={15}
                                className="
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-500
                                "
                            />

                            <input
                                type="text"
                                placeholder="Search emails..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-gray-200
                                    bg-gray-50
                                    py-2
                                    pl-9
                                    pr-3
                                    text-base
                                    text-gray-700
                                    outline-none
                                    transition-all
                                    placeholder:text-gray-500
                                    focus:border-[#004aad]/30
                                    focus:bg-white
                                    focus:ring-2
                                    focus:ring-[#004aad]/10
                                "
                            />
                        </div>
                    </div>
                </div>

                {/* Loading */}
                {isLoading && <DataSkeleton layout="cards" rows={4} label="Loading email templates" />}

                {/* Empty */}
                {!isLoading && filtered.length === 0 && (
                    <div
                        className="
                            rounded-2xl
                            border
                            border-gray-100
                            bg-white
                            px-6
                            py-16
                            text-center
                            shadow-sm
                        "
                    >
                        <div
                            className="
                                mx-auto
                                mb-4
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-full
                                bg-blue-50
                            "
                        >
                            <Mail
                                size={21}
                                className="text-[#004aad]"
                            />
                        </div>

                        <h3 className="text-base font-bold text-gray-900">
                            {search
                                ? "No emails found"
                                : "You haven't created any emails yet"}
                        </h3>

                        <p className="mx-auto mt-1 max-w-sm text-base text-gray-500">
                            {search
                                ? "Try searching with a different name or description."
                                : "Create your first email template to start communicating with your customers."}
                        </p>

                        {!search && (
                            <button
                                type="button"
                                onClick={handleCreateTemplate}
                                className="
                                    mt-5
                                    inline-flex
                                    cursor-pointer
                                    items-center
                                    gap-2
                                    rounded-xl
                                    bg-[#004aad]
                                    px-4
                                    py-3.5
                                    text-base
                                    font-semibold
                                    text-white
                                    transition-all
                                    hover:bg-[#003985]
                                "
                            >
                                <Plus size={16} />
                                Create your first email
                            </button>
                        )}
                    </div>
                )}

                {/* Templates */}
                {!isLoading && filtered.length > 0 && (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                        {filtered.map((template) => (
                            <div
                                key={template.templateId}
                                className="
                                    group
                                    rounded-2xl
                                    border
                                    border-gray-100
                                    bg-white
                                    p-5
                                    shadow-sm
                                    transition-all
                                    duration-200
                                    hover:border-gray-200
                                    hover:shadow-md
                                "
                            >
                                {/* Top */}
                                <div className="flex items-start justify-between gap-3">

                                    <span
                                        className={`
                                            inline-flex
                                            items-center
                                            rounded-lg
                                            border
                                            px-2.5
                                            py-1
                                            text-xs
                                            font-bold
                                            ${categoryStyles[template.category]}
                                        `}
                                    >
                                        {categoryLabels[template.category]}
                                    </span>

                                    <button
                                        type="button"
                                        className="
                                            flex
                                            h-7
                                            w-7
                                            cursor-pointer
                                            items-center
                                            justify-center
                                            rounded-lg
                                            text-gray-500
                                            transition
                                            hover:bg-gray-50
                                            hover:text-gray-700
                                        "
                                        aria-label="More options"
                                    >
                                        <MoreHorizontal size={16} />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="mt-4">

                                    <h3
                                        className="
                                            text-base
                                            font-bold
                                            tracking-tight
                                            text-gray-900
                                            transition-colors
                                            group-hover:text-[#004aad]
                                        "
                                    >
                                        {template.name}
                                    </h3>

                                    <p
                                        className="
                                            mt-1.5
                                            min-h-[40px]
                                            line-clamp-2
                                            text-base
                                            leading-relaxed
                                            text-gray-500
                                        "
                                    >
                                        {template.description}
                                    </p>
                                </div>

                                {/* Metadata */}
                                <div
                                    className="
                                        mt-5
                                        flex
                                        flex-wrap
                                        items-center
                                        gap-x-4
                                        gap-y-2
                                        border-t
                                        border-gray-100
                                        pt-4
                                    "
                                >
                                    {/* Status */}
                                    <span
                                        className={`
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-md
                                            px-2
                                            py-1
                                            text-xs
                                            font-bold
                                            ${statusStyles[template.status]}
                                        `}
                                    >
                                        <span
                                            className={`
                                                h-1.5
                                                w-1.5
                                                rounded-full
                                                ${
                                                    template.status ===
                                                    "PUBLISHED"
                                                        ? "bg-emerald-500"
                                                        : template.status ===
                                                          "ARCHIVED"
                                                        ? "bg-red-500"
                                                        : "bg-gray-400"
                                                }
                                            `}
                                        />

                                        {statusLabels[template.status]}
                                    </span>

                                    {/* Updated */}
                                    <span
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            text-sm
                                            text-gray-500
                                        "
                                    >
                                        <Clock3 size={12} />

                                        Updated{" "}
                                        {formatDate(template.updatedAt)}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="mt-4 flex items-center gap-2">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handlePreviewTemplate(
                                                template.templateId
                                            )
                                        }
                                        className="
                                            flex-1
                                            cursor-pointer
                                            inline-flex
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-xl
                                            border
                                            border-gray-200
                                            bg-gray-50
                                            py-3.5
                                            text-sm
                                            font-semibold
                                            text-gray-700
                                            transition-all
                                            hover:bg-gray-100
                                        "
                                    >
                                        <Eye size={14} />
                                        Preview
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleEditTemplate(
                                                template.templateId
                                            )
                                        }
                                        className="
                                            flex-1
                                            cursor-pointer
                                            inline-flex
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-xl
                                            bg-[#004aad]
                                            py-3.5
                                            text-sm
                                            font-semibold
                                            text-white
                                            transition-all
                                            hover:bg-[#003985]
                                        "
                                    >
                                        <Edit2 size={14} />
                                        Edit email
                                    </button>

                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Count */}
                {!isLoading && templates.length > 0 && (
                    <div className="pt-2 text-center">
                        <p className="text-sm text-gray-500">
                            Showing {filtered.length} of{" "}
                            {templates.length} emails
                        </p>
                    </div>
                )}
            </div>

            {/* Create Email Modal */}
            <CreateEmailTemplateModal
                open={isCreateModalOpen}
                isCreating={createTemplateMutation.isPending}
                onClose={() => {
                    if (!createTemplateMutation.isPending) {
                        setIsCreateModalOpen(false);
                    }
                }}
                onCreate={handleCreate}
            />
        </>
    );
}
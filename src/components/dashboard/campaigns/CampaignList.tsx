
import {
    ArrowUpRight,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Mail,
    Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { CampaignPageResponse, CampaignSummary } from "../../../features/campaigns/types/campaign";

interface CampaignListProps {
    data: CampaignPageResponse;
    onPageChange: (page: number) => void;
}

const CampaignList = ({ data, onPageChange }: CampaignListProps) => {
    const navigate = useNavigate();

    const {
        content: campaigns,
        number: currentPage,
        totalPages,
        totalElements,
    } = data;

    const getStatusStyle = (status: string) => {
        switch (status?.toUpperCase()) {
            case "COMPLETED":
                return "bg-green-50 text-green-700 border-green-100";

            case "PROCESSING":
                return "bg-blue-50 text-[#004aad] border-blue-100";

            case "PENDING":
                return "bg-amber-50 text-amber-700 border-amber-100";

            case "FAILED":
                return "bg-red-50 text-red-600 border-red-100";

            default:
                return "bg-gray-100 text-gray-600 border-gray-200";
        }
    };

    const formatDate = (date: string) => {
        if (!date) return "N/A";

        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(new Date(date));
    };

    const formatTime = (date: string) => {
        if (!date) return "";

        return new Intl.DateTimeFormat("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(date));
    };

    // Generate a small range of page numbers
    const getPageNumbers = () => {
        const pages: number[] = [];

        const start = Math.max(0, currentPage - 2);
        const end = Math.min(totalPages - 1, currentPage + 2);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    const openCampaign = (campaign: CampaignSummary) => {
        navigate(`/dashboard/campaigns/${campaign.campaignId}`, {
            state: { campaign },
        });
    };

    return (
        <section className="w-full mt-8">

            {/* Table heading */}
            <div className="flex flex-col gap-2 mb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        All Campaigns
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage and monitor your email campaigns.
                    </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="h-2 w-2 rounded-full bg-[#004aad]" />
                    {totalElements} campaigns in total
                </div>
            </div>

            {/* Table container */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px] border-collapse text-left">

                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/80">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Campaign
                                </th>

                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Email details
                                </th>

                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Recipients
                                </th>

                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Created
                                </th>

                                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">

                            {campaigns.map((campaign) => (
                                <tr
                                    key={campaign.campaignId}
                                    className="group transition-colors hover:bg-blue-50/30"
                                >
                                    {/* Campaign name */}
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#004aad] transition-colors group-hover:bg-[#004aad] group-hover:text-white">
                                                <Mail size={19} />
                                            </div>

                                            <div className="max-w-[220px]">
                                                <button
                                                    type="button"
                                                    onClick={() => openCampaign(campaign)}
                                                    className="truncate text-left text-sm font-bold text-gray-900 hover:text-[#004aad]"
                                                >
                                                    {campaign.name}
                                                </button>

                                                <p className="mt-1 font-mono text-[10px] text-gray-400">
                                                    ID: {campaign.campaignId.slice(0, 8)}...
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Email details */}
                                    <td className="px-6 py-5">
                                        <div className="max-w-[200px]">
                                            <p className="truncate text-sm font-medium text-gray-700">
                                                {campaign.subject}
                                            </p>

                                            <p className="mt-1 truncate text-xs text-gray-400">
                                                {campaign.templateVersionId || "Email template"}
                                            </p>
                                        </div>
                                    </td>

                                    {/* Recipients */}
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                                                <Users size={15} />
                                            </div>

                                            <span className="text-sm font-semibold text-gray-700">
                                                {campaign.totalRecipients}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusStyle(campaign.status)}`}>
                                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                            {campaign.status}
                                        </span>
                                    </td>

                                    {/* Date */}
                                    <td className="px-6 py-5">
                                        <div className="flex items-start gap-2">
                                            <CalendarDays size={15} className="mt-0.5 text-gray-400" />

                                            <div>
                                                <p className="text-sm font-medium text-gray-700">
                                                    {formatDate(campaign.createdAt)}
                                                </p>

                                                <p className="mt-1 text-xs text-gray-400">
                                                    {formatTime(campaign.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* View action */}
                                    <td className="px-6 py-5 text-right">
                                        <button
                                            type="button"
                                            onClick={() => openCampaign(campaign)}
                                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-600 transition-all hover:border-[#004aad] hover:bg-[#004aad] hover:text-white"
                                        >
                                            View campaign
                                            <ArrowUpRight size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col gap-4 border-t border-gray-100 bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

                    <p className="text-xs font-medium text-gray-500">
                        Showing{" "}
                        <span className="font-bold text-gray-900">
                            {totalElements === 0 ? 0 : currentPage * data.size + 1}
                        </span>
                        {" "}to{" "}
                        <span className="font-bold text-gray-900">
                            {Math.min((currentPage + 1) * data.size, totalElements)}
                        </span>
                        {" "}of{" "}
                        <span className="font-bold text-gray-900">
                            {totalElements}
                        </span>
                        {" "}campaigns
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5">

                        <button
                            type="button"
                            disabled={currentPage === 0}
                            onClick={() => onPageChange(currentPage - 1)}
                            className="flex h-9 items-center gap-1 rounded-lg border border-gray-200 px-3 text-xs font-semibold text-gray-600 transition-colors hover:border-[#004aad] hover:text-[#004aad] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft size={15} />
                            <span>Previous</span>
                        </button>

                        {getPageNumbers().map((page) => (
                            <button
                                key={page}
                                type="button"
                                onClick={() => onPageChange(page)}
                                className={`h-9 min-w-9 rounded-lg px-3 text-xs font-bold transition-colors ${
                                    currentPage === page
                                        ? "bg-[#004aad] text-white shadow-sm"
                                        : "border border-gray-200 text-gray-600 hover:border-[#004aad] hover:text-[#004aad]"
                                }`}
                            >
                                {page + 1}
                            </button>
                        ))}

                        <button
                            type="button"
                            disabled={currentPage >= totalPages - 1 || totalPages === 0}
                            onClick={() => onPageChange(currentPage + 1)}
                            className="flex h-9 items-center gap-1 rounded-lg border border-gray-200 px-3 text-xs font-semibold text-gray-600 transition-colors hover:border-[#004aad] hover:text-[#004aad] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <span>Next</span>
                            <ChevronRight size={15} />
                        </button>

                    </div>
                </div>

            </div>
        </section>
    );
};

export default CampaignList;

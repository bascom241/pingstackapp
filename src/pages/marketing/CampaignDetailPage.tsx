import { useState, type ChangeEvent } from "react";
import {
  ArrowLeft,
  CalendarDays,
  FileJson2,
  FileText,
  Loader2,
  Mail,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useCampaign } from "../../features/campaigns/hooks/useEmailCampaign";
import type {
  CampaignSummary,
  EmailRecipientRequest,
} from "../../features/campaigns/types/campaign";
import ErrorCampaign from "../../../utils/ErrorUI";

const isEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const normalizeRecipients = (value: unknown): EmailRecipientRequest[] => {
  const entries = Array.isArray(value) ? value : [value];
  if (entries.length === 0) {
    throw new Error("Provide at least one recipient.");
  }

  return entries.map((entry) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new Error("Each recipient must be an object with an email address.");
    }

    const recipient = entry as Record<string, unknown>;
    const email = typeof recipient.email === "string" ? recipient.email.trim() : "";
    const name = typeof recipient.name === "string" ? recipient.name.trim() : "";

    if (!isEmail(email)) {
      throw new Error("Each recipient must have a valid email address.");
    }

    return { name, email };
  });
};

const parseCsv = (csv: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let insideQuotes = false;

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];

    if (character === '"') {
      if (insideQuotes && csv[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (character === "," && !insideQuotes) {
      row.push(field.trim());
      field = "";
    } else if ((character === "\n" || character === "\r") && !insideQuotes) {
      if (character === "\r" && csv[index + 1] === "\n") index += 1;
      row.push(field.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (insideQuotes) {
    throw new Error("The CSV contains an unclosed quoted field.");
  }

  row.push(field.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
};

const formatDate = (value: string | null) => {
  if (!value) return "Not started";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unavailable";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const CampaignDetailPage = () => {
  const { campaignId = "" } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [recipients, setRecipients] = useState<EmailRecipientRequest[]>([]);
  const [jsonInput, setJsonInput] = useState("");

  const stateCampaign = (location.state as { campaign?: CampaignSummary } | null)?.campaign;
  const campaignFromState =
    stateCampaign?.campaignId === campaignId ? stateCampaign : undefined;
  const {
    data,
    isPending,
    isError,
  } = useCampaign(0, 100, !campaignFromState);
  const campaign = campaignFromState ?? data?.content.find(
    (item) => item.campaignId === campaignId,
  );

  const addRecipients = (newRecipients: EmailRecipientRequest[]) => {
    setRecipients((current) => [...current, ...newRecipients]);
    enqueueSnackbar(
      `${newRecipients.length} recipient${newRecipients.length === 1 ? "" : "s"} added locally. No changes were sent to the server.`,
      { variant: "success" },
    );
  };

  const handleJsonImport = () => {
    try {
      addRecipients(normalizeRecipients(JSON.parse(jsonInput)));
      setJsonInput("");
    } catch (error) {
      enqueueSnackbar(
        error instanceof SyntaxError
          ? "Enter valid JSON containing recipient objects."
          : error instanceof Error
            ? error.message
            : "Unable to read recipient JSON.",
        { variant: "error" },
      );
    }
  };

  const handleCsvImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;

    try {
      const rows = parseCsv(await file.text());
      const headers = rows.shift()?.map((header, index) =>
        (index === 0 ? header.replace(/^\uFEFF/, "") : header).toLowerCase(),
      );
      const emailIndex = headers?.indexOf("email") ?? -1;
      const nameIndex = headers?.indexOf("name") ?? -1;

      if (emailIndex < 0) {
        throw new Error('CSV must include an "email" header; "name" is optional.');
      }

      const imported = rows.map((row) => ({
        email: row[emailIndex] ?? "",
        name: nameIndex < 0 ? "" : row[nameIndex] ?? "",
      }));
      addRecipients(normalizeRecipients(imported));
    } catch (error) {
      enqueueSnackbar(
        error instanceof Error ? error.message : "Unable to import this CSV file.",
        { variant: "error" },
      );
    } finally {
      input.value = "";
    }
  };

  if (!campaignFromState && isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#004aad]" size={42} />
      </div>
    );
  }

  if (!campaignFromState && isError) {
    return <ErrorCampaign text="Campaign details" />;
  }

  if (!campaign) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] px-5 py-10 sm:px-10">
        <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-gray-900">Campaign not found</h1>
          <p className="mt-2 text-sm text-gray-500">
            This campaign is not available in the current campaign list.
          </p>
          <button
            type="button"
            onClick={() => navigate("/dashboard/campaigns")}
            className="mt-6 rounded-xl bg-[#004aad] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Back to campaigns
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-5 py-8 sm:px-10 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => navigate("/dashboard/campaigns")}
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-[#004aad]"
        >
          <ArrowLeft size={17} />
          Back to campaigns
        </button>

        <header className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase text-[#004aad]">
            <Mail size={14} />
            Email campaign
          </div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
            {campaign.name}
          </h1>
          <p className="mt-2 break-all text-sm text-gray-500">
            Campaign ID: {campaign.campaignId}
          </p>
        </header>

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-6 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#004aad]">
                <FileText size={20} />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Campaign details</h2>
                <p className="text-xs text-gray-500">Content and delivery progress</p>
              </div>
            </div>
            <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#004aad]">
              {campaign.status}
            </span>
          </div>

          <div className="grid gap-6 px-6 py-7 sm:grid-cols-2 sm:px-8">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Email subject
              </p>
              <p className="break-all text-sm font-semibold text-gray-800">
                {campaign.subject || "Not set"}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Template ID
              </p>
              <p className="break-all font-mono text-xs text-gray-600">
                {campaign.templateId || "Not set"}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Template version
              </p>
              <p className="break-all font-mono text-xs text-gray-600">
                {campaign.templateVersionId || "Not set"}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Created
              </p>
              <p className="flex items-center gap-2 text-sm text-gray-700">
                <CalendarDays size={15} className="text-gray-400" />
                {formatDate(campaign.createdAt)}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Started
              </p>
              <p className="flex items-center gap-2 text-sm text-gray-700">
                <CalendarDays size={15} className="text-gray-400" />
                {formatDate(campaign.startedAt)}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Total recipients", value: campaign.totalRecipients },
            { label: "Processed", value: campaign.processedRecipients },
            { label: "Failed", value: campaign.failedRecipients },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                {stat.label}
              </p>
              <p className="mt-2 text-2xl font-black text-gray-900">{stat.value}</p>
            </div>
          ))}
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#004aad]">
                <Users size={20} />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Add recipients</h2>
                <p className="text-xs text-gray-500">
                  Import recipients with JSON or a CSV file. Imports are local only for now.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
            <div className="space-y-3">
              <label
                htmlFor="campaign-recipient-json"
                className="flex items-center gap-2 text-sm font-bold text-gray-800"
              >
                <FileJson2 size={17} className="text-[#004aad]" />
                Paste recipient JSON
              </label>
              <p className="text-xs text-gray-500">
                Use one recipient or an array with <code>name</code> and <code>email</code> fields.
              </p>
              <textarea
                id="campaign-recipient-json"
                value={jsonInput}
                onChange={(event) => setJsonInput(event.target.value)}
                placeholder={'[{"name":"Jane Smith","email":"jane@example.com"}]'}
                rows={5}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 font-mono text-xs text-gray-800 outline-none transition focus:border-[#004aad] focus:bg-white focus:ring-4 focus:ring-[#004aad]/10"
              />
              <button
                type="button"
                onClick={handleJsonImport}
                disabled={!jsonInput.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-[#004aad] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Users size={15} />
                Add JSON recipients
              </button>
            </div>

            <div className="space-y-3">
              <p className="flex items-center gap-2 text-sm font-bold text-gray-800">
                <Upload size={17} className="text-[#004aad]" />
                Upload CSV
              </p>
              <p className="text-xs text-gray-500">
                Include an <code>email</code> column. A <code>name</code> column is optional.
              </p>
              <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 text-center transition hover:border-[#004aad] hover:bg-blue-50/40">
                <Upload size={20} className="text-[#004aad]" />
                <span className="text-sm font-semibold text-gray-700">Choose a CSV file</span>
                <span className="text-xs text-gray-400">CSV files are read in this browser only</span>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleCsvImport}
                  className="sr-only"
                />
              </label>
            </div>
          </div>

          {recipients.length > 0 && (
            <div className="border-t border-gray-100 px-6 py-5 sm:px-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900">Added in this session</h3>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#004aad]">
                  {recipients.length} recipient{recipients.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="space-y-2">
                {recipients.map((recipient, index) => (
                  <div
                    key={`${recipient.email}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-800">
                        {recipient.name || "Unnamed recipient"}
                      </p>
                      <p className="truncate text-xs text-gray-500">{recipient.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setRecipients((current) =>
                          current.filter((_, recipientIndex) => recipientIndex !== index),
                        )
                      }
                      aria-label={`Remove ${recipient.email}`}
                      className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default CampaignDetailPage;

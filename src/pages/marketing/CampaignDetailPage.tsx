import { useState, type ChangeEvent } from "react";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  Loader2,
  Mail,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAddRecipient, useCampaign, useSingleCampaign } from "../../features/campaigns/hooks/useEmailCampaign";
import type {
  CampaignSummary,
  EmailRecipientRequest,
} from "../../features/campaigns/types/campaign";
import ErrorCampaign from "../../../utils/ErrorUI";
import { getApiErrorMessage } from "../../utils/apiError";

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
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");

  const stateCampaign = (location.state as { campaign?: CampaignSummary } | null)?.campaign;

  const campaignFromState =
    stateCampaign?.campaignId === campaignId ? stateCampaign : undefined;

 


  const {data: campaign, isPending, isError} = useSingleCampaign(campaignId);


  console.log(campaign)

  const { mutate, isPending: addingRecipient} = useAddRecipient()



  console.log(campaign)

  const addRecipients = (newRecipients: EmailRecipientRequest[]) => {
    console.log(recipients)
    setRecipients((current) => [...current, ...newRecipients]);

    console.log(recipients)
    enqueueSnackbar(
      `${newRecipients.length} recipient${newRecipients.length === 1 ? "" : "s"} added locally. No changes were sent to the server.`,
      { variant: "success" },
    );
  };

  const handleAddRecipient = () => {
    const name = recipientName.trim();
    const email = recipientEmail.trim();


   
    if (!name || !email) {
      enqueueSnackbar("Please provide both name and email.", {
        variant: "error",
      });
      return;
    }

    if (!isEmail(email)) {
      enqueueSnackbar("Please enter a valid email address.", {
        variant: "error",
      });
      return;
    }


    const dataToSubmit = {
      campaignId,
      recipient: [
        {
          name,
          email
        }
      ]
    }


    console.log(dataToSubmit)

    mutate(dataToSubmit, {
      onSuccess: () => {
        setRecipientName("")
        setRecipientEmail("")
        enqueueSnackbar("Recipients added successfully", {
          variant: "success"
        })
      },
      onError: (error: any) => {
        const errorMessage = getApiErrorMessage(error, "Something went wrong");
        enqueueSnackbar(errorMessage || "Failed to add recipient!", {
          variant: "error"
        })
      }
    })

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
                  Add recipients individually or import multiple recipients with a CSV file. Changes are local only for now.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-2">
            {/* Manual recipient input */}
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-gray-800">
                  Add recipient manually
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Enter the recipient's name and email address.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="recipient-name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Full name
                  </label>
                  <input
                    id="recipient-name"
                    type="text"
                    value={recipientName}
                    onChange={(event) => setRecipientName(event.target.value)}
                    placeholder="e.g. John Doe"
                    autoComplete="name"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#004aad] focus:bg-white focus:ring-4 focus:ring-[#004aad]/10"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="recipient-email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <input
                    id="recipient-email"
                    type="email"
                    value={recipientEmail}
                    onChange={(event) => setRecipientEmail(event.target.value)}
                    placeholder="john@example.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#004aad] focus:bg-white focus:ring-4 focus:ring-[#004aad]/10"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddRecipient}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#004aad] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >

                  {
                    addingRecipient ? <Loader2 className="animate-spin"/> : <><Users size={16} /> Add recipient</>
                  }
                  
                </button>
              </div>
            </div>

            {/* CSV upload */}
            <div className="space-y-4">
              <div>
                <p className="flex items-center gap-2 text-sm font-bold text-gray-800">
                  <Upload size={17} className="text-[#004aad]" />
                  Upload CSV
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Import multiple recipients using a CSV file.
                </p>
              </div>

              <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 text-center transition hover:border-[#004aad] hover:bg-blue-50/40">
                <Upload size={24} className="text-[#004aad]" />
                <span className="text-sm font-semibold text-gray-700">
                  Choose a CSV file
                </span>
                <span className="text-xs text-gray-400">
                  CSV must contain an email column and optionally a name column.
                </span>
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
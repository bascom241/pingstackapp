To integrate the full template editing, versioning history, and Unlayer UI into your frontend, you need a sub-view or modal that triggers when a user clicks Preview or Blueprint (Edit) on a template card.

Your backend endpoints follow this flow:

Get Single Template & Versions: Fetch details using getSingleEmailTemplate (which returns the current version, design JSON, HTML, and version number).

Edit/Create New Version: Save updates using editTemplateVersion which automatically increments your template version (currentVersion + 1).

Unlayer Editor Integration: Load the existing designJson into the Unlayer instance on mount, and pull out the updated designJson and rendered htmlContent when saving.

Here is how you can implement a complete EmailTemplateEditor.tsx component that connects your backend API hooks and the Unlayer editor.

1. Create the Editor Component (EmailTemplateEditor.tsx)
Create or update this component where users can modify the subject, see the version history counter, and edit the layout via Unlayer:

TypeScript
import { useRef, useState } from "react";
import EmailEditor from "react-email-editor";
import { ArrowLeft, Save, Layers } from "lucide-react";
import { useGetSingleTemplate, useEditTemplateVersion } from "../../features/templates/hooks/useTemplate";

type Props = {
  templateId: string;
  onBack: () => void;
};

export default function EmailTemplateEditorView({ templateId, onBack }: Props) {
  const emailEditorRef = useRef<any>(null);
  const [subject, setSubject] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch current template version data from your backend
  const { data: templateVersion, isLoading } = useGetSingleTemplate(templateId);
  const editVersionMutation = useEditTemplateVersion();

  // Handle loading design json into Unlayer once fetched
  const handleEditorLoaded = () => {
    setIsLoaded(true);
    if (templateVersion?.designJson && emailEditorRef.current) {
      try {
        const designObject = JSON.parse(templateVersion.designJson);
        emailEditorRef.current.editor.loadDesign(designObject);
      } catch (e) {
        console.error("Failed to parse designJson", e);
      }
    }
    if (templateVersion?.subject) {
      setSubject(templateVersion.subject);
    }
  };

  // Save updates (Triggers version increment on your Spring Boot backend)
  const handleSaveVersion = () => {
    const unlayer = emailEditorRef.current?.editor;

    if (!unlayer) return;

    unlayer.exportHtml((data: { design: object; html: string }) => {
      const { design, html } = data;

      editVersionMutation.mutate({
        templateId,
        payload: {
          subject: subject || templateVersion?.subject || "Untitled Notification",
          designJson: JSON.stringify(design),
          htmlContent: html,
        },
      }, {
        onSuccess: () => {
          alert("Template version updated successfully! Version incremented.");
          onBack();
        },
        onError: (err) => {
          console.error("Failed to save template version", err);
          alert("Error saving template version.");
        }
      });
    });
  };

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-white border border-gray-100 rounded-2xl text-xs text-gray-400">
        Loading template editor workspace...
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      {/* Top Action Header */}
      <div className="flex items-center justify-between bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-gray-900">
                {templateVersion?.subject || "Editing Template Blueprint"}
              </h2>
              <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                <Layers size={10} /> v{templateVersion?.version || 1}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Modifying layout increments the version state automatically on Pingstack.
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveVersion}
          disabled={editVersionMutation.isPending}
          className="bg-[#004aad] hover:bg-[#003985] text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
        >
          <Save size={14} />
          <span>{editVersionMutation.isPending ? "Saving Version..." : "Save New Version"}</span>
        </button>
      </div>

      {/* Subject Line Configuration Bar */}
      <div className="bg-white border border-gray-100 p-3 rounded-xl shadow-sm flex items-center gap-3">
        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide pl-1">Subject:</span>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter email subject line..."
          className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-[#004aad]/10"
        />
      </div>

      {/* Unlayer Editor Canvas Container */}
      <div className="bg-white border border-gray-100 rounded-2xl p-2 shadow-sm h-[700px]">
        <EmailEditor
          ref={emailEditorRef}
          onLoad={handleEditorLoaded}
          minHeight="680px"
        />
      </div>
    </div>
  );
}
2. Wire it into your EmailTemplates list view
To switch back and forth between your template directory and the Unlayer editor view, track the active editing ID in state:

TypeScript
// Inside EmailTemplates.tsx:
const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);

// If editing ID is set, render the editor instead of the list:
if (editingTemplateId) {
  return (
    <EmailTemplateEditor 
      templateId={editingTemplateId} 
      onBack={() => setEditingTemplateId(null)} 
    />
  );
}

// Inside your template card action buttons:
<button 
  onClick={() => setEditingTemplateId(tpl.emailTemplateId)}
  className="flex-1 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold text-[10px] py-1.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all"
>
  <Edit2 size={12} /> Blueprint
</button>
3. Expected React Query Hooks Setup
Make sure your custom hooks (useGetSingleTemplate and useEditTemplateVersion) map correctly to your backend routes:

GET Single Template Version: Calls your /api/templates/{templateId} endpoint.

PUT Edit Version: Calls your /api/templates/{templateId}/versions (or corresponding mapping) endpoint passing subject, designJson, and htmlContent.


## Template code  {/* Helper Syntax Lexicon Panel (Left) */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
            <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
              <Code size={14} />
            </div>
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">Dynamic Tokens</span>
          </div>

          <p className="text-[11px] text-gray-400 leading-normal">
            Inject handles inside layouts to pipe real-time payload definitions contextually.
          </p>

          <div className="space-y-1.5 pt-1">
            {[
              { token: "{{user.firstName}}", desc: "Subscriber First Name" },
              { token: "{{action.secureUrl}}", desc: "Login/Verification Target Link" },
              { token: "{{billing.amount}}", desc: "Invoice Currency Value" }
            ].map((v, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-100/70 font-mono text-[10px]">
                <div className="flex flex-col min-w-0">
                  <span className="text-[#004aad] font-bold truncate">{v.token}</span>
                  <span className="text-[9px] text-gray-400 font-sans mt-0.5">{v.desc}</span>
                </div>
                <button
                  onClick={() => handleCopyVar(v.token)}
                  className="text-gray-300 hover:text-gray-600 p-1 transition-colors cursor-pointer"
                >
                  {copiedVar === v.token ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
                </button>
              </div>
            ))}
          </div>
        </div>
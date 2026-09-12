import { useState } from "react";
import { Plus, Search, Eye, Edit2,  Layers } from "lucide-react";

import { useGetTemplateForUser } from "../../features/templates/hooks/useTemplate";
import { useNavigate } from "react-router-dom";
// Matches your backend EmailTemplate response structure
type Template = {
  templateId: string;
  name: string;
  category: "TRANSACTIONAL" | "MARKETING" | "LIFECYCLE";
  description: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  currentVersion: number;
  updatedAt: string;
};

export default function EmailTemplates() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "TRANSACTIONAL" | "MARKETING" | "LIFECYCLE">("all");
  const [copiedVar, setCopiedVar] = useState<string | null>(null);
  const { data: templates = [], isLoading } = useGetTemplateForUser() as { data: Template[] | undefined, isLoading: boolean };
  console.log(templates)



  const navigate = useNavigate();
  const handleCopyVar = (variable: string) => {
    navigator.clipboard.writeText(variable);
    setCopiedVar(variable);
    setTimeout(() => setCopiedVar(null), 1500);
  };

  const filtered = templates.filter(t => {
    const matchTab = activeTab === "all" || t.category === activeTab;
    const matchSearch = t.name?.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });


  
  const handleTemplateCreation = (destination: string) => {
      navigate(destination)
  }


  

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">

      {/* Top Deck Core Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Email Blueprint Templates</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Construct dynamic components using variable arrays or sync custom HTML injections seamlessly.
          </p>
        </div>

        <button className="bg-[#004aad] hover:bg-[#003985] text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-[#004aad]/10"
         
        >
          <Plus size={14} />
          <span>New Template</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

       

        {/* Main Workspace Canvas (Right) */}
        <div className="lg:col-span-3 space-y-4">

          {/* Functional Filters Row */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div className="flex bg-white border border-gray-100 p-0.5 rounded-xl shadow-sm max-w-sm overflow-x-auto">
              {(["all", "TRANSACTIONAL", "MARKETING", "LIFECYCLE"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === tab ? "bg-[#004aad]/5 text-[#004aad]" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {tab.toLowerCase()}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-48">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#004aad]/10"
              />
            </div>
          </div>

          {/* Grid Layout Generation Mapping */}
          {isLoading ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center text-xs text-gray-400 shadow-sm">
              Loading templates from server...
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center space-y-2 shadow-sm">
              <p className="text-xs font-bold text-gray-700">No templates found</p>
              <p className="text-[11px] text-gray-400">Get started by creating your first email blueprint template.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((tpl) => (
                <div key={tpl.templateId} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 group relative">

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-black tracking-wide uppercase px-2 py-0.5 rounded-md ${
                        tpl.category === "TRANSACTIONAL" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                        tpl.category === "MARKETING" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                        "bg-purple-50 text-purple-700 border border-purple-100"
                      }`}>
                        {tpl.category}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400 font-semibold flex items-center gap-1">
                        <Layers size={10} /> v{tpl.currentVersion}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-gray-800 tracking-tight group-hover:text-[#004aad] transition-colors pt-1">
                      {tpl.name}
                    </h3>
                    <p className="text-[10px] text-gray-400 line-clamp-2">{tpl.description}</p>
                  </div>

                  {/* Micro Action Bar Layout */}
                  <div className="flex items-center gap-1.5 border-t border-gray-50 pt-3">
                    <button className="flex-1 bg-gray-50 border border-gray-200 hover:bg-[#004aad]/5 hover:border-[#004aad]/20 hover:text-[#004aad] text-gray-600 font-bold text-[10px] py-1.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all"
                    onClick={() => navigate(`/dashboard/email-templates/${tpl.templateId}`)}
                    >
                      <Eye size={12} /> Preview
                    </button>
                    <button className="flex-1 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold text-[10px] py-1.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all">
                      <Edit2 size={12} /> Blueprint
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
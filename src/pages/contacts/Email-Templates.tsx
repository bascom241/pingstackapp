import React, { useState } from "react";
import { FileText, Plus, Search, Eye, Edit2, Code, Layout, Layers, Tag, Copy, Check } from "lucide-react";

type Template = {
  id: string;
  name: string;
  category: "Transactional" | "Marketing" | "Lifecycle";
  lastModified: string;
  usageMetric: string;
};

export default function EmailTemplates() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "Transactional" | "Marketing" | "Lifecycle">("all");
  const [copiedVar, setCopiedVar] = useState<string | null>(null);

  const templates: Template[] = [
    { id: "t1", name: "Secure Magic Login Link", category: "Transactional", lastModified: "3 hrs ago", usageMetric: "42.8k hits" },
    { id: "t2", name: "Corporate Invoice Manifest", category: "Transactional", lastModified: "1 day ago", usageMetric: "129.1k hits" },
    { id: "t3", name: "User Milestone Engagement", category: "Lifecycle", lastModified: "4 days ago", usageMetric: "8.9k hits" },
    { id: "t4", name: "Q3 Premium Feature Rollout", category: "Marketing", lastModified: "1 week ago", usageMetric: "410.5k hits" },
  ];

  const handleCopyVar = (variable: string) => {
    navigator.clipboard.writeText(variable);
    setCopiedVar(variable);
    setTimeout(() => setCopiedVar(null), 1500);
  };

  const filtered = templates.filter(t => {
    const matchTab = activeTab === "all" || t.category === activeTab;
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

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
        
        <button className="bg-[#004aad] hover:bg-[#003985] text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-[#004aad]/10">
          <Plus size={14} />
          <span>New Template</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Helper Syntax Lexicon Panel (Left) */}
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

        {/* Main Workspace Canvas (Right) */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Functional Filters Row */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div className="flex bg-white border border-gray-100 p-0.5 rounded-xl shadow-sm max-w-sm">
              {(["all", "Transactional", "Marketing", "Lifecycle"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer ${
                    activeTab === tab ? "bg-[#004aad]/5 text-[#004aad]" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {tab}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((tpl) => (
              <div key={tpl.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 group relative">
                
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-black tracking-wide uppercase px-2 py-0.5 rounded-md ${
                      tpl.category === "Transactional" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                      tpl.category === "Marketing" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                      "bg-purple-50 text-purple-700 border border-purple-100"
                    }`}>
                      {tpl.category}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400 font-semibold">{tpl.usageMetric}</span>
                  </div>
                  
                  <h3 className="text-xs font-bold text-gray-800 tracking-tight group-hover:text-[#004aad] transition-colors pt-1">
                    {tpl.name}
                  </h3>
                  <p className="text-[10px] text-gray-400">Modified {tpl.lastModified}</p>
                </div>

                {/* Micro Action Bar Layout */}
                <div className="flex items-center gap-1.5 border-t border-gray-50 pt-3">
                  <button className="flex-1 bg-gray-50 border border-gray-200 hover:bg-[#004aad]/5 hover:border-[#004aad]/20 hover:text-[#004aad] text-gray-600 font-bold text-[10px] py-1.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all">
                    <Eye size={12} /> Preview
                  </button>
                  <button className="flex-1 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold text-[10px] py-1.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all">
                    <Edit2 size={12} /> Blueprint
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
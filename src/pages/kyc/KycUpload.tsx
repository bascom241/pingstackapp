import React, { useState } from "react";
import { ShieldCheck, UploadCloud, AlertCircle, FileText, CheckCircle2, Building2, Clock, ShieldAlert } from "lucide-react";

export default function KycVerification() {
  const [entityType, setEntityType] = useState("Corporate");
  const [legalName, setLegalName] = useState("Pingstack Tech Ltd");
  const [regNumber, setRegNumber] = useState("RC-19283049");
  const [uploadedFiles, setUploadedFiles] = useState([
    { name: "Certificate_of_Incorporation.pdf", size: "2.4 MB", type: "Core Doc", status: "Approved" },
    { name: "Tax_Clearance_2026.pdf", size: "1.1 MB", type: "Financial", status: "Pending" }
  ]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Compliance & Identity Vetting (KYC)</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Verify corporate regulatory files to fulfill global carrier anti-spam mandates and unlock unrestricted high-volume trunks.
        </p>
      </div>

      {/* Compliance Tier Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-500 text-white rounded-xl mt-0.5 shadow-sm shadow-amber-500/20">
            <ShieldAlert size={16} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-900">Node Status: Provisional Clearance (Tier 1)</h4>
            <p className="text-[11px] text-amber-700/90 mt-0.5 max-w-xl">
              You are restricted to 5,000 dispatches daily. Upload valid global corporate entity authentication proofs to lift throttling barriers.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg shrink-0">
          Daily Cap: 5,000 / 5,000 Remaining
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Form Registry */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-gray-50">
              <div className="p-1.5 bg-[#004aad]/5 text-[#004aad] rounded-lg">
                <Building2 size={15} />
              </div>
              <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Corporate Registry Profile</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase text-gray-400">Legal Business Entity Type</label>
                <div className="flex gap-2">
                  {["Corporate", "Sole Proprietorship"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setEntityType(t)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        entityType === t ? "bg-[#004aad]/5 border-[#004aad] text-[#004aad]" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase text-gray-400">Registered Corporate Name</label>
                <input 
                  type="text" 
                  value={legalName} 
                  onChange={(e) => setLegalName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-[#004aad]/10"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase text-gray-400">Tax ID / Company Registration Number</label>
              <input 
                type="text" 
                value={regNumber} 
                onChange={(e) => setRegNumber(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono text-gray-700 outline-none focus:ring-2 focus:ring-[#004aad]/10"
              />
            </div>
          </div>

          {/* Secure Upload Node Dropzone */}
          <div className="bg-white border border-dashed border-gray-200 hover:border-[#004aad]/40 transition-colors rounded-2xl p-6 shadow-sm text-center cursor-pointer flex flex-col items-center justify-center group">
            <div className="p-3 bg-slate-50 text-gray-400 group-hover:text-[#004aad] rounded-2xl border border-gray-100/60 mb-2 transition-colors">
              <UploadCloud size={22} />
            </div>
            <p className="text-xs font-bold text-gray-700">Drop corporate compliance documents here</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Supports high-res PDF, PNG up to 10MB (Certificate of Incorporation, Tax Slips)</p>
          </div>
        </div>

        {/* Verification Matrix Trackers (Right) */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-gray-50">
              <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                <ShieldCheck size={15} />
              </div>
              <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Document Registry Cache</h2>
            </div>

            <div className="space-y-2">
              {uploadedFiles.map((file, idx) => (
                <div key={idx} className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex items-center justify-between gap-3 text-xs font-medium">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText size={14} className="text-gray-400 shrink-0" />
                    <div className="min-w-0 flex flex-col">
                      <span className="text-gray-700 font-bold truncate max-w-[140px]">{file.name}</span>
                      <span className="text-[9px] text-gray-400 font-mono mt-0.5">{file.size} • {file.type}</span>
                    </div>
                  </div>

                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    file.status === "Approved" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700 animate-pulse"
                  }`}>
                    {file.status}
                  </span>
                </div>
              ))}
            </div>

            <button type="submit" className="w-full bg-[#004aad] hover:bg-[#003985] text-white font-semibold text-xs py-2.5 rounded-xl transition-all shadow-sm">
              Commit for Attestation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Link } from "react-router-dom";
import { Key, Copy, Check, ArrowUpRight, Code2 } from "../../../ui/icons";

import { apiUrl } from "../../../api/config";
const baseUrl = apiUrl("").replace(/\/$/, "");

export default function DeveloperSettings() {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(baseUrl);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }
  return (
    <div className="dashboard-card">
      <div className="flex items-center gap-2.5 mb-2"><Code2 size={21} className="text-[#004aad]" /><h2 className="dashboard-card-title">Developer access</h2></div>
      <p className="dashboard-card-description">Connect your app to Pingstack.</p>
      <div className="overview-credentials">
        <div className="flex items-center justify-between gap-2"><span className="dashboard-section-label">Base URL</span><button onClick={() => void copyUrl()} className="dashboard-icon-button -my-2! -mr-2!" aria-label="Copy API base URL">{copyState === "copied" ? <Check size={17} className="text-emerald-600" /> : <Copy size={17} />}</button></div>
        <code>{baseUrl}</code>
        <span role="status" className="text-xs text-slate-500">{copyState === "copied" ? "URL copied" : copyState === "error" ? "Could not copy. Select the URL to copy it manually." : ""}</span>
      </div>
      <Link to="/dashboard/api-keys" className="dashboard-button w-full"><Key size={17} />Manage API keys<ArrowUpRight size={16} className="ml-auto" /></Link>
      <Link to="/dashboard/otp-guide" className="dashboard-text-link mt-5">Explore the OTP guide <ArrowUpRight size={16} /></Link>
    </div>
  );
}

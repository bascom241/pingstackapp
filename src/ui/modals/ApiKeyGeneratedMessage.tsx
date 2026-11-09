import { X, Check, Copy, AlertTriangle } from "../icons";
import { useState } from "react"
import { motion } from "framer-motion"

interface ApiKeyGeneratedMessageProps {
  apiKey: string
  setOpen: (value: boolean) => void
  message: string
}

const ApiKeyGeneratedMessage = ({
  apiKey ,
  setOpen,
  message
}: ApiKeyGeneratedMessageProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xl max-w-sm w-full space-y-5"
      >
        {/* Header Section: Title & Cancel Button */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-900">
              API Key Generated
            </h3>
            <p className="text-xs text-gray-500">
              Please copy your key now. You won't be able to see it again!
            </p>
          </div>
          
          {/* Cancel/Close X Button */}
          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Key Display & Copy Action */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Your secret API Key</label>
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-xs text-slate-800 break-all">
            <span className="truncate mr-2">{apiKey}</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-sans font-medium transition-all shrink-0 active:scale-95 shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Warning Badge */}
        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200/60 p-3 rounded-xl text-amber-800 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
           {message ?? " Store this key in a secure location. If lost, you will need to regenerate a new key."}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-1">
          <button
            onClick={() => setOpen(false)}
            className="w-full bg-[#004aad] hover:bg-[#003985] text-white font-medium py-2.5 px-4 rounded-xl text-sm transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default ApiKeyGeneratedMessage
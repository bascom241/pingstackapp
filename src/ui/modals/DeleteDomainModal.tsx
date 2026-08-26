// src/components/email/DeleteDomainModal.tsx
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

interface DeleteDomainModalProps {
  isOpen: boolean;
  onClose: () => void;
  domainName: string;
  onConfirmDelete: () => void;
  isDeleting?: boolean;
}

const DeleteDomainModal: React.FC<DeleteDomainModalProps> = ({
  isOpen,
  onClose,
  domainName,
  onConfirmDelete,
  isDeleting = false,
}) => {
  const [confirmationInput, setConfirmationInput] = useState("");

  useEffect(() => {
    if (!isOpen) setConfirmationInput("");
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, isDeleting]);

  if (!isOpen) return null;

  const isMatched = confirmationInput.trim().toLowerCase() === domainName.trim().toLowerCase();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isMatched && !isDeleting) {
      onConfirmDelete();
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => !isDeleting && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xl max-w-sm w-full space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header & Warning Icon */}
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-red-50 text-red-600 rounded-xl shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Delete Domain
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                This action <strong className="text-red-600 font-semibold">cannot</strong> be undone. Email sending and DNS verifications linked to this domain will stop immediately.
              </p>
            </div>
          </div>

          {/* Form and Input Prompt */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-gray-600 font-medium">
                To confirm, type <span className="font-mono font-bold text-[#004aad] select-all">{domainName}</span> below:
              </label>
              <input
                type="text"
                autoFocus
                disabled={isDeleting}
                value={confirmationInput}
                onChange={(e) => setConfirmationInput(e.target.value)}
                placeholder={domainName}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono text-gray-800 placeholder:text-gray-300 outline-none focus:ring-2 focus:ring-[#004aad]/10 focus:border-[#004aad] transition-all disabled:opacity-50"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-1.5 pt-2 border-t border-gray-50">
              <button
                type="button"
                disabled={isDeleting}
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isMatched || isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer shadow-sm shadow-red-600/10 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="animate-spin" size={14} />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={13} />
                    <span>Delete Domain</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DeleteDomainModal;
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDanger = true,
}: ConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-sm bg-white dark:bg-[#24303f] shadow-2xl"
          >
            {/* Header */}
            <div className="px-6 py-6 flex items-start gap-4">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm",
                isDanger ? "bg-red-50 text-red-500" : "bg-indigo-50 text-indigo-500"
              )}>
                <AlertTriangle size={24} />
              </div>

              <div className="flex-1 min-w-0 pr-4">
                <h3 className="text-xl font-black text-[#1c2434] dark:text-white uppercase tracking-tighter mb-2">
                  {title}
                </h3>
                <p className="text-sm font-bold text-[#8a99af] leading-relaxed">
                  {message}
                </p>
              </div>

              <button
                onClick={onClose}
                className="text-slate-400 hover:text-[#1c2434] dark:hover:text-white transition-colors"
              >
                <X size={20} className="mt-1" />
              </button>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex flex-col md:flex-row-reverse gap-3">
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={cn(
                  "py-3 px-8 rounded-sm font-black text-xs uppercase tracking-widest shadow-lg transition-all hover:bg-opacity-90",
                  isDanger 
                    ? "bg-red-500 text-white shadow-red-500/20" 
                    : "bg-[#3c50e0] text-white shadow-indigo-500/20"
                )}
              >
                {confirmLabel}
              </button>
              <button
                onClick={onClose}
                className="py-3 px-8 rounded-sm font-black text-xs uppercase tracking-widest text-[#1c2434] dark:text-white bg-white dark:bg-slate-700 border border-[#e2e8f0] dark:border-[#313d4a] hover:bg-slate-50 transition-all"
              >
                {cancelLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

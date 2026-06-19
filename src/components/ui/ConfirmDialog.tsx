"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "./Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isLoading ? undefined : onCancel}
            className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-paper-card w-full max-w-md rounded-2xl2 shadow-soft-lg border border-line overflow-hidden pointer-events-auto"
            >
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-accent-coral/10 text-accent-coral flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-semibold text-ink mb-2">
                  {title}
                </h3>
                <p className="text-ink-muted leading-relaxed">
                  {message}
                </p>
              </div>
              <div className="p-4 bg-paper-sunken border-t border-line flex items-center justify-end gap-3">
                <Button
                  variant="secondary"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="bg-white"
                >
                  {cancelLabel}
                </Button>
                <Button
                  variant="primary"
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="bg-accent-coral hover:bg-accent-coral/90 text-white shadow-soft"
                >
                  {isLoading ? "Processing..." : confirmLabel}
                </Button>
              </div>
              <button
                onClick={onCancel}
                disabled={isLoading}
                className="absolute top-4 right-4 text-ink-muted hover:text-ink transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

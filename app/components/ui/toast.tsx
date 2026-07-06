import React from "react"
import { toast as hotToast } from "react-hot-toast"

export const toast = {
  success: (message: string, options?: any) => {
    return hotToast.success(message, {
      ...options,
      style: {
        background: "var(--bg-secondary, #ffffff)",
        color: "var(--text-main, #0f172a)",
        border: "1px solid var(--border-color, #e2e8f0)",
        borderRadius: "var(--radius, 10px)",
      }
    })
  },
  error: (message: string, options?: any) => {
    return hotToast.error(message, {
      ...options,
      style: {
        background: "var(--bg-secondary, #ffffff)",
        color: "var(--text-main, #0f172a)",
        border: "1px solid #fecaca",
        borderRadius: "var(--radius, 10px)",
      }
    })
  },
  loading: (message: string, options?: any) => {
    return hotToast.loading(message, {
      ...options,
      style: {
        background: "var(--bg-secondary, #ffffff)",
        color: "var(--text-main, #0f172a)",
        border: "1px solid var(--border-color, #e2e8f0)",
        borderRadius: "var(--radius, 10px)",
      }
    })
  },
  custom: hotToast.custom,
  dismiss: hotToast.dismiss,
}

export default function ToastShowcase() {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      <button
        onClick={() => toast.success("Operation completed successfully!")}
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-sm border-0"
      >
        Trigger Success
      </button>
      <button
        onClick={() => toast.error("An error occurred during build.")}
        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-sm border-0"
      >
        Trigger Error
      </button>
      <button
        onClick={() => {
          const loadId = toast.loading("Deploying components...");
          setTimeout(() => {
            toast.dismiss(loadId);
            toast.success("Successfully deployed!");
          }, 2000);
        }}
        className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-sm border-0"
      >
        Trigger Loading (2s)
      </button>
    </div>
  )
}

"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ShortcutAction, useEditorStore } from "@/store/useEditorStore";
import { GripVertical, Trash2, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { ACTIONS_LIBRARY } from "@/lib/actions-library";
import { useState } from "react";

interface Props {
  action: ShortcutAction;
}

function ParamInput({
  param,
  value,
  onChange,
}: {
  param: { name: string; label: string; type: string; placeholder?: string; options?: string[] };
  value: string;
  onChange: (val: string) => void;
}) {
  const baseInputClass =
    "w-full bg-white dark:bg-[#24303f] border border-[#e2e8f0] dark:border-[#313d4a] rounded-sm px-4 py-3 text-sm text-[#1c2434] dark:text-[#dee4ee] placeholder:text-slate-400 focus:outline-none focus:border-[#3c50e0] transition-colors shadow-sm outline-none";

  if (param.type === "boolean") {
    return (
      <button
        type="button"
        onClick={() => onChange(value === "true" ? "false" : "true")}
        className={cn(
          "relative w-12 h-6.5 rounded-full transition-all flex-shrink-0 shadow-inner",
          value === "true" ? "bg-[#3c50e0]" : "bg-slate-200 dark:bg-slate-700"
        )}
      >
        <div
          className={cn(
            "absolute top-1 left-1 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform",
            value === "true" ? "translate-x-5.5" : "translate-x-0"
          )}
        />
      </button>
    );
  }

  if (param.type === "select" && param.options) {
    return (
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(baseInputClass, "cursor-pointer appearance-none pr-10 font-medium")}
        >
          <option value="" className="text-slate-900">Select an option...</option>
          {param.options.map((opt) => (
            <option key={opt} value={opt} className="text-slate-900">
              {opt}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    );
  }

  if (param.type === "textarea") {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(baseInputClass, "resize-none h-32 leading-relaxed")}
        placeholder={param.placeholder}
      />
    );
  }

  return (
    <input
      type={param.type === "number" ? "number" : param.type === "url" ? "url" : "text"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={baseInputClass}
      placeholder={param.placeholder || "Type here..."}
    />
  );
}

export function ActionCard({ action }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: action.id });
  const { updateActionParam, removeAction, errors } = useEditorStore();
  const error = errors[action.id];
  const [showHint, setShowHint] = useState(false);

  const definition = ACTIONS_LIBRARY.find((a) => a.type === action.type);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "panel-card p-6 flex flex-col gap-5 border-l-4",
        error ? "border-red-500" : "border-[#3c50e0]"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab text-slate-300 dark:text-slate-600 hover:text-[#3c50e0] transition-colors"
          >
            <GripVertical size={22} />
          </button>
          <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-sm flex items-center justify-center text-2xl border border-slate-100 dark:border-white/5">
            {action.icon}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-[#1c2434] dark:text-white text-base leading-tight truncate">
              {action.label}
            </span>
            {definition && (
              <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-1 font-medium">
                {definition.description}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {definition?.hint && (
            <button
              onClick={() => setShowHint((v) => !v)}
              className={cn(
                "p-2.5 rounded-sm transition-all border",
                showHint
                  ? "bg-[#3c50e0] text-white border-[#3c50e0] shadow-sm"
                  : "bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-white/5 hover:text-[#3c50e0]"
              )}
            >
              <Info size={18} />
            </button>
          )}
          <button
            onClick={() => removeAction(action.id)}
            className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-sm transition-all border border-transparent"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Hint Panel - TailAdmin Style */}
      {showHint && definition?.hint && (
        <div className="bg-slate-50 dark:bg-[#1a222c] border-l-4 border-[#3c50e0] p-5 animate-in slide-in-from-left-2 duration-300">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[#3c50e0]/10 flex items-center justify-center flex-shrink-0">
                <Info size={16} className="text-[#3c50e0]" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase tracking-widest text-[#3c50e0]">Usage Guidelines</h4>
              <p className="text-sm font-medium leading-relaxed text-[#1c2434] dark:text-[#dee4ee]">{definition.hint}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-4 rounded-sm flex items-center gap-3">
          <AlertCircle size={18} className="text-red-500 shrink-0" />
          <span className="text-xs font-bold text-red-700 dark:text-red-400">{error}</span>
        </div>
      )}

      {action.params.length > 0 && (
        <div className="space-y-5 pt-2">
          {action.params.map((param) => {
            const schema = definition?.params.find((p) => p.name === param.name);
            return (
              <div key={param.name} className="flex flex-col gap-2.5">
                <label className="text-xs font-bold text-[#1c2434] dark:text-[#dee4ee] px-0.5">
                  {schema?.label ?? param.name}
                </label>
                <ParamInput
                  param={{ ...param, label: schema?.label ?? param.name, options: schema?.options }}
                  value={param.value}
                  onChange={(val) => updateActionParam(action.id, param.name, val)}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

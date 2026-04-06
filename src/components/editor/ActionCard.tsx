"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ShortcutAction, useEditorStore } from "@/store/useEditorStore";
import { GlassCard } from "@/components/ui/GlassCard";
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
    "w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-white/20 rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 transition-all shadow-sm";

  if (param.type === "boolean") {
    return (
      <button
        type="button"
        onClick={() => onChange(value === "true" ? "false" : "true")}
        className={cn(
          "relative w-12 h-7 rounded-full transition-all flex-shrink-0 shadow-inner",
          value === "true" ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"
        )}
      >
        <span
          className={cn(
            "absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform",
            value === "true" ? "translate-x-5" : "translate-x-0"
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
          className={cn(
            baseInputClass,
            "cursor-pointer appearance-none pr-10 font-medium"
          )}
        >
          <option value="" className="bg-white dark:bg-slate-900 text-slate-900">Select...</option>
          {param.options.map((opt) => (
            <option key={opt} value={opt} className="bg-white dark:bg-slate-900 text-slate-900">
              {opt}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
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
        className={cn(baseInputClass, "resize-none h-28 mb-1 leading-relaxed")}
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
      placeholder={param.placeholder}
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
    <GlassCard
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex flex-col gap-4 relative border-l-8 shadow-2xl transition-all hover:shadow-indigo-500/10",
        error ? "border-red-600" : "border-indigo-600"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab text-slate-400 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <GripVertical size={24} />
          </button>
          <span className="text-2xl shrink-0">{action.icon}</span>
          <div className="flex flex-col min-w-0">
            <span className="font-black text-slate-900 dark:text-slate-100 text-sm md:text-base leading-tight truncate">
              {action.label}
            </span>
            {definition && (
              <span className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-0.5 font-bold tracking-tight">
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
                "p-2.5 rounded-xl transition-all",
                showHint
                  ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/40"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <Info size={18} />
            </button>
          )}
          <button
            onClick={() => removeAction(action.id)}
            className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Hint Panel - MAX CONTRAST */}
      {showHint && definition?.hint && (
        <div className="flex gap-4 bg-indigo-100/80 dark:bg-indigo-900/40 border border-indigo-300 dark:border-indigo-500/50 rounded-2xl p-5 text-sm font-semibold text-indigo-900 dark:text-indigo-100 leading-relaxed animate-in fade-in zoom-in-95 duration-200">
          <Info size={20} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-black text-[10px] uppercase tracking-widest text-indigo-500 dark:text-indigo-300">Yönerge</p>
            <p>{definition.hint}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 text-sm font-bold text-red-900 dark:text-red-200 bg-red-100 dark:bg-red-500/20 p-4 rounded-xl border border-red-300 dark:border-red-500/30">
          <AlertCircle size={20} className="text-red-600 dark:text-red-400 shrink-0" />
          {error}
        </div>
      )}

      {action.params.length > 0 && (
        <div className="space-y-5 pt-2">
          {action.params.map((param) => {
            const schema = definition?.params.find((p) => p.name === param.name);
            return (
              <div key={param.name} className="flex flex-col gap-2.5">
                <label className="text-[11px] text-slate-900 dark:text-slate-200 font-black uppercase tracking-[0.2em] px-1">
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
    </GlassCard>
  );
}

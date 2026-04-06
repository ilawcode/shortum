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
    "w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all";

  if (param.type === "boolean") {
    return (
      <button
        type="button"
        onClick={() => onChange(value === "true" ? "false" : "true")}
        className={cn(
          "relative w-11 h-6 rounded-full transition-all flex-shrink-0",
          value === "true" ? "bg-indigo-600" : "bg-slate-700"
        )}
      >
        <span
          className={cn(
            "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform",
            value === "true" ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    );
  }

  if (param.type === "select" && param.options) {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(baseInputClass, "cursor-pointer appearance-none bg-slate-900 shadow-sm")}
      >
        <option value="" className="bg-slate-900">Select...</option>
        {param.options.map((opt) => (
          <option key={opt} value={opt} className="bg-slate-900">
            {opt}
          </option>
        ))}
      </select>
    );
  }

  if (param.type === "textarea") {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(baseInputClass, "resize-none h-24 mb-1")}
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
        "flex flex-col gap-4 relative border-l-4 shadow-2xl",
        error ? "border-red-500" : "border-indigo-500/80"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab text-slate-400 hover:text-white"
          >
            <GripVertical size={20} />
          </button>
          <span className="text-xl shrink-0">{action.icon}</span>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-slate-100 text-sm leading-tight truncate">
              {action.label}
            </span>
            {definition && (
              <span className="text-xs text-slate-300 line-clamp-1 opacity-70">{definition.description}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {definition?.hint && (
            <button
              onClick={() => setShowHint((v) => !v)}
              title="Show usage guideline"
              className={cn(
                "p-2 rounded-lg transition-all",
                showHint
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-700"
              )}
            >
              <Info size={16} />
            </button>
          )}
          <button
            onClick={() => removeAction(action.id)}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Hint Panel */}
      {showHint && definition?.hint && (
        <div className="flex gap-3 bg-indigo-600/15 border border-indigo-500/30 rounded-xl p-4 text-xs text-indigo-100 leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
          <Info size={16} className="text-indigo-400 flex-shrink-0 mt-0.5" />
          <span>{definition.hint}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-200 bg-red-500/20 p-3 rounded-xl border border-red-500/30">
          <AlertCircle size={16} className="text-red-400 shrink-0" />
          {error}
        </div>
      )}

      {action.params.length > 0 && (
        <div className="space-y-4 pt-1">
          {action.params.map((param) => {
            const schema = definition?.params.find((p) => p.name === param.name);
            return (
              <div key={param.name} className="flex flex-col gap-2">
                <label className="text-xs text-slate-200 font-semibold uppercase tracking-widest opacity-80">
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

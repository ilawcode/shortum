"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ShortcutAction, useEditorStore } from "@/store/useEditorStore";
import { GlassCard } from "@/components/ui/GlassCard";
import { GripVertical, Trash2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ACTIONS_LIBRARY } from "@/lib/actions-library";

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
    "w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors";

  if (param.type === "boolean") {
    return (
      <button
        type="button"
        onClick={() => onChange(value === "true" ? "false" : "true")}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors flex-shrink-0",
          value === "true" ? "bg-indigo-500" : "bg-white/10"
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
        className={cn(baseInputClass, "cursor-pointer")}
      >
        <option value="">Select...</option>
        {param.options.map((opt) => (
          <option key={opt} value={opt}>
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
        className={cn(baseInputClass, "resize-none h-20")}
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
        "flex flex-col gap-3 relative border-l-4",
        error ? "border-red-500" : "border-indigo-500"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab text-slate-500 hover:text-white"
          >
            <GripVertical size={20} />
          </button>
          <span className="text-lg">{action.icon}</span>
          <div className="flex flex-col">
            <span className="font-medium text-slate-200 text-sm leading-tight">
              {action.label}
            </span>
            {definition && (
              <span className="text-xs text-slate-500">{definition.description}</span>
            )}
          </div>
        </div>
        <button
          onClick={() => removeAction(action.id)}
          className="text-red-400/70 hover:text-red-400 transition-colors flex-shrink-0"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-400 bg-red-400/10 p-2 rounded-lg">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {action.params.length > 0 && (
        <div className="mt-1 space-y-3">
          {action.params.map((param) => {
            const schema = definition?.params.find((p) => p.name === param.name);
            return (
              <div key={param.name} className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">
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

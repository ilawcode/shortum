"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ShortcutAction, useEditorStore } from "@/store/useEditorStore";
import { GlassCard } from "@/components/ui/GlassCard";
import { GripVertical, Trash2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
    action: ShortcutAction;
}

export function ActionCard({ action }: Props) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: action.id });
    const { updateActionParam, removeAction, errors } = useEditorStore();
    const error = errors[action.id];

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
                    <button {...attributes} {...listeners} className="cursor-grab text-slate-500 hover:text-white">
                        <GripVertical size={20} />
                    </button>
                    <span className="font-medium text-slate-200">{action.label}</span>
                </div>
                <button onClick={() => removeAction(action.id)} className="text-red-400/70 hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                </button>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-xs text-red-400 bg-red-400/10 p-2 rounded-lg mt-2">
                    <AlertCircle size={14} />
                    {error}
                </div>
            )}

            <div className="mt-2 space-y-3">
                {action.params.map(param => (
                    <div key={param.name} className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">{param.name}</label>
                        <input
                            type="text"
                            value={param.value}
                            onChange={(e) => updateActionParam(action.id, param.name, e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                            placeholder={param.type === 'variable' ? 'Enter variable name...' : 'Enter value...'}
                        />
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}

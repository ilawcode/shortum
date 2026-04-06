"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useEditorStore } from "@/store/useEditorStore";
import { ActionCard } from "@/components/editor/ActionCard";
import { CreditModal } from "@/components/editor/CreditModal";
import { SimulatorModal } from "@/components/editor/SimulatorModal";
import { useState } from "react";
import { Check, Info, Play } from "lucide-react";

const ALLOWED_ACTIONS = [
    { type: "com.apple.shortcuts.scripting.text", label: "Text", icon: "T" },
    { type: "com.apple.shortcuts.weather.get", label: "Get Weather", icon: "W" },
    { type: "com.apple.shortcuts.audio.speak", label: "Speak Text", icon: "S" },
];

export default function EditorPage() {
    const { actions, errors, addAction, reorderActions } = useEditorStore();
    const [projectId, setProjectId] = useState<string | null>(null);
    const [showSimulator, setShowSimulator] = useState(false);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            reorderActions(active.id as string, over.id as string);
        }
    };

    const handleAddTemplate = (actionType: any) => {
        addAction({
            type: actionType.type,
            label: actionType.label,
            icon: actionType.icon,
            params: [{ name: "Input", value: "", type: "text" }]
        });
    };

    const hasErrors = Object.keys(errors).length > 0;
    const isSaveDisabled = actions.length === 0 || hasErrors;

    if (!projectId) {
        return <CreditModal onConfirm={setProjectId} />;
    }

    return (
        <div className="h-[calc(100vh-64px)] md:h-screen w-full flex flex-col p-4 gap-4 overflow-hidden relative">
            <GlassCard className="py-4 px-6 flex items-center justify-between flex-shrink-0 z-10 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <h1 className="font-semibold text-lg">Project: {projectId}</h1>
                    {hasErrors && (
                        <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-md font-medium flex items-center gap-1">
                            <Info size={12} /> Needs Fix
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowSimulator(true)}
                        disabled={isSaveDisabled}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-500/20 hover:bg-slate-500/30 text-white transition-colors flex items-center gap-2"
                    >
                        <Play size={16} /> Run Simulator
                    </button>
                    <button
                        disabled={isSaveDisabled}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 disabled:cursor-not-allowed text-white transition-colors flex items-center gap-2"
                    >
                        <Check size={16} /> Save Sequence
                    </button>
                </div>
            </GlassCard>

            <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0 z-10">
                {/* Canvas Area */}
                <div className="flex-1 glass-surface rounded-2xl border border-white/10 p-4 md:p-8 overflow-y-auto">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={actions} strategy={verticalListSortingStrategy}>
                            <div className="flex flex-col gap-4 max-w-2xl mx-auto pb-32">
                                {actions.length === 0 ? (
                                    <div className="text-center mt-20 text-slate-500 space-y-4">
                                        <p>Click on actions from the library to add them here.</p>
                                    </div>
                                ) : (
                                    actions.map(action => <ActionCard key={action.id} action={action} />)
                                )}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>

                {/* Toolbar Library */}
                <GlassCard className="w-full md:w-80 flex-shrink-0 overflow-y-auto flex flex-col gap-4">
                    <h2 className="font-semibold text-sm uppercase tracking-wider text-slate-500">Allowed Actions</h2>
                    <div className="space-y-3">
                        {ALLOWED_ACTIONS.map((action) => (
                            <button
                                key={action.type}
                                onClick={() => handleAddTemplate(action)}
                                className="w-full text-left p-3 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                                    {action.icon}
                                </div>
                                <div className="text-sm font-medium text-slate-300">{action.label}</div>
                            </button>
                        ))}
                    </div>
                </GlassCard>
            </div>

            {showSimulator && projectId && (
                <SimulatorModal shortcutId={projectId} onClose={() => setShowSimulator(false)} />
            )}
        </div>
    );
}

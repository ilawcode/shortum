"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Play, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
    shortcutId: string;
    onClose: () => void;
}

export function SimulatorModal({ shortcutId, onClose }: Props) {
    const [logs, setLogs] = useState<{ id: number; message: string; type: 'info' | 'success' | 'error' }[]>([]);
    const [isRunning, setIsRunning] = useState(false);

    const addLog = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
        setLogs(prev => [...prev, { id: Date.now() + Math.random(), message, type }]);
    };

    const runSimulation = async () => {
        setLogs([]);
        setIsRunning(true);
        addLog(`Fetching shortcut ${shortcutId}...`, 'info');

        try {
            const res = await fetch(`/api/s/${shortcutId}`);
            if (!res.ok) throw new Error("Failed to fetch shortcut data.");

            const contentJson = await res.json();
            addLog(`Downloaded ${contentJson.length} actions. Starting engine...`, 'success');

            // Variables dictionary like iOS
            const memory: Record<string, string> = {};

            for (let i = 0; i < contentJson.length; i++) {
                const action = contentJson[i];
                addLog(`Executing [${i + 1}/${contentJson.length}]: ${action.label || action.type}`, 'info');

                await new Promise(r => setTimeout(r, 600)); // Simulate processing delay

                if (action.type === 'com.apple.shortcuts.scripting.text') {
                    const textParam = action.params.find((p: any) => p.name === 'Input')?.value || '';
                    if (action.outputName) {
                        memory[action.outputName] = textParam;
                        addLog(`📝 Assigned Text to Variable '${action.outputName}': "${textParam}"`, 'success');
                    } else {
                        addLog(`📝 Processed Text: "${textParam}"`, 'info');
                    }
                }
                else if (action.type === 'com.apple.shortcuts.audio.speak') {
                    const inputParam = action.params.find((p: any) => p.name === 'Input')?.value || '';
                    // Resolve variable if needed
                    const finalValue = memory[inputParam] !== undefined ? memory[inputParam] : inputParam;
                    addLog(`🔊 Speaking: "${finalValue}"`, 'success');
                }
                else {
                    addLog(`⚠️ Unknown or unsupported action type: ${action.type}`, 'info');
                }
            }

            addLog("✅ Routine execution finished.", 'success');
            toast.success("Simulation Complete");

        } catch (err: any) {
            addLog(`Simulation aborted. Error: ${err.message}`, 'error');
            toast.error("Simulation failed");
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <GlassCard className="max-w-2xl w-full flex flex-col gap-4 border border-white/10 shadow-2xl overflow-hidden h-[600px]">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3 text-indigo-400">
                        <Play size={20} />
                        <h2 className="font-semibold text-lg text-white">Debugger & Engine Simulator</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="flex-1 bg-black/40 rounded-xl border border-white/5 p-4 overflow-y-auto font-mono text-sm flex flex-col gap-2">
                    {logs.length === 0 ? (
                        <div className="text-slate-500 h-full flex items-center justify-center">
                            Press Run to start simulation
                        </div>
                    ) : (
                        logs.map(log => (
                            <div key={log.id} className={cn(
                                "py-1",
                                log.type === 'error' ? "text-red-400" :
                                    log.type === 'success' ? "text-emerald-400" : "text-slate-300"
                            )}>
                                <span className="text-slate-600 mr-2">{'>'}</span>{log.message}
                            </div>
                        ))
                    )}
                </div>

                <div className="flex justify-end pt-4 border-t border-white/10 mt-auto flex-shrink-0">
                    <button
                        disabled={isRunning}
                        onClick={runSimulation}
                        className="px-6 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors flex items-center gap-2">
                        {isRunning ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
                        {isRunning ? "Simulating..." : "Run Simulator"}
                    </button>
                </div>
            </GlassCard>
        </div>
    );
}

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
    const [logs, setLogs] = useState<{ id: number; message: string; type: 'info' | 'success' | 'error' | 'warn' | 'system' }[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [lastOutput, setLastOutput] = useState<string | null>(null);

    const addLog = (message: string, type: 'info' | 'success' | 'error' | 'warn' | 'system' = 'info') => {
        setLogs(prev => [...prev, { id: Date.now() + Math.random(), message, type }]);
    };

    const resolveValue = (val: string, memory: Record<string, any>) => {
        if (!val) return "";
        // Simple variable resolution: {{varName}}
        return val.replace(/\{\{(.*?)\}\}/g, (_, key) => {
            return memory[key.trim()] !== undefined ? memory[key.trim()] : `[${key}?]`;
        });
    };

    const runSimulation = async () => {
        setLogs([]);
        setLastOutput(null);
        setIsRunning(true);
        addLog(`Initiating System Boot...`, 'system');
        addLog(`Fetching Process ID: ${shortcutId}`, 'info');

        try {
            const res = await fetch(`/api/s/${shortcutId}`);
            if (!res.ok) throw new Error("Connection to factory lost. Resource not found.");

            const shortcutData = await res.json();
            const actions = shortcutData.content_json || [];

            addLog(`Sequence Loaded: ${actions.length} commands found.`, 'system');
            addLog(`Compiling Routines...`, 'info');

            const memory: Record<string, any> = {};
            let currentOutput: any = null;

            for (let i = 0; i < actions.length; i++) {
                const action = actions[i];
                addLog(`Executing [${i + 1}/${actions.length}]: ${action.label || action.type}`, 'system');

                await new Promise(r => setTimeout(r, 800));

                const params = action.params || [];
                const getParam = (name: string) => params.find((p: any) => p.name === name)?.value || "";

                switch (action.type) {
                    case 'scripting.text': {
                        const rawText = getParam('text');
                        currentOutput = resolveValue(rawText, memory);
                        addLog(`📝 Buffer assigned value: "${currentOutput}"`, 'success');
                        break;
                    }
                    case 'scripting.set_variable': {
                        const varName = getParam('variable');
                        const rawVal = getParam('value');
                        // If value is empty, we use currentOutput (pipe behavior)
                        const valToStore = rawVal ? resolveValue(rawVal, memory) : currentOutput;
                        memory[varName] = valToStore;
                        addLog(`📦 Variable '${varName}' stored successfully.`, 'success');
                        break;
                    }
                    case 'scripting.get_variable': {
                        const varName = getParam('variable');
                        currentOutput = memory[varName];
                        addLog(`📂 Variable '${varName}' retrieved: "${currentOutput}"`, 'success');
                        break;
                    }
                    case 'audio.speak_text': {
                        const rawText = getParam('text');
                        const textToSpeak = resolveValue(rawText, memory) || currentOutput;
                        addLog(`🔊 AUD-Engine: Speaking session started: "${textToSpeak}"`, 'success');
                        break;
                    }
                    case 'scripting.show_alert': {
                        const msg = resolveValue(getParam('message'), memory) || currentOutput;
                        addLog(`🔔 UI-Interupt: Alert displayed with message: "${msg}"`, 'warn');
                        break;
                    }
                    default:
                        addLog(`⚠️ Non-executable or unsupported in simulation: ${action.type}`, 'warn');
                        break;
                }
            }

            setLastOutput(currentOutput);
            addLog("🏁 Cycle Complete. All commands processed successfully.", 'success');
            toast.success("Routine Finished");

        } catch (err: any) {
            addLog(`CRITICAL FAILURE: ${err.message}`, 'error');
            toast.error("Simulation Aborted");
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1c2434]/80 backdrop-blur-md p-4">
            <div className="panel-card max-w-2xl w-full flex flex-col bg-white dark:bg-[#1c2434] shadow-2xl overflow-hidden h-[650px] border-[#313d4a]">
                <div className="flex items-center justify-between border-b border-[#e2e8f0] dark:border-[#313d4a] px-6 py-4 bg-white dark:bg-[#24303f]">
                    <div className="flex items-center gap-3 text-[#3c50e0]">
                        <Zap size={20} fill="currentColor" />
                        <h2 className="font-black text-lg text-[#1c2434] dark:text-white uppercase tracking-tighter">Debug Console / Engine V1</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-sm text-slate-400 hover:text-red-500 transition-all">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 bg-slate-900 overflow-y-auto p-6 font-mono text-xs flex flex-col gap-2.5 leading-relaxed">
                    {logs.length === 0 ? (
                        <div className="text-slate-600 h-full flex flex-col items-center justify-center gap-4">
                            <Play size={40} className="opacity-20 animate-pulse" />
                            <p className="uppercase font-black tracking-widest text-[10px]">Ready to process automation hub...</p>
                        </div>
                    ) : (
                        logs.map(log => (
                            <div key={log.id} className={cn(
                                "flex gap-3",
                                log.type === 'error' ? "text-red-400" :
                                log.type === 'success' ? "text-emerald-400" : 
                                log.type === 'warn' ? "text-amber-400" :
                                log.type === 'system' ? "text-indigo-400 font-bold" : "text-slate-400"
                            )}>
                                <span className={cn(
                                    "flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black",
                                    log.type === 'error' ? "bg-red-500/20 text-red-500" :
                                    log.type === 'success' ? "bg-emerald-500/20 text-emerald-500" : 
                                    log.type === 'warn' ? "bg-amber-500/20 text-amber-500" :
                                    log.type === 'system' ? "bg-indigo-500/20 text-indigo-500" : "bg-slate-700 text-slate-400"
                                )}>
                                    {log.type === 'system' ? 'S' : log.type === 'error' ? '!' : log.type === 'warn' ? '?' : '>'}
                                </span>
                                <span>{log.message}</span>
                            </div>
                        ))
                    )}
                </div>

                {lastOutput && (
                    <div className="px-6 py-4 bg-emerald-500/10 border-t border-emerald-500/20 flex flex-col gap-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Final Output Buffer</p>
                        <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 break-all">{lastOutput}</p>
                    </div>
                )}

                <div className="flex justify-between items-center px-6 py-5 border-t border-[#e2e8f0] dark:border-[#313d4a] bg-white dark:bg-[#24303f]">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8a99af]">
                        Engine Status: {isRunning ? "Active" : "Idle"}
                    </div>
                    <button
                        disabled={isRunning}
                        onClick={runSimulation}
                        className="px-10 py-3 rounded-sm bg-[#3c50e0] hover:bg-opacity-90 text-white font-black uppercase tracking-widest text-xs transition-all flex items-center gap-3 shadow-lg shadow-indigo-500/20 disabled:opacity-50">
                        {isRunning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
                        {isRunning ? "Running..." : "Initiate Routine"}
                    </button>
                </div>
            </div>
        </div>
    );
}


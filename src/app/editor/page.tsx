import { GlassCard } from "@/components/ui/GlassCard";

export default function EditorPage() {
    return (
        <div className="h-screen w-full flex flex-col p-4 gap-4 overflow-hidden">
            {/* Editor Header */}
            <GlassCard className="py-4 px-6 flex items-center justify-between flex-shrink-0">
                <h1 className="font-semibold text-lg">Untitled Shortcut</h1>
                <div className="flex items-center gap-4">
                    <button className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-500/20 hover:bg-slate-500/30 transition-colors">
                        Preview JSON
                    </button>
                    <button className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-500 hover:bg-indigo-600 text-white transition-colors">
                        Publish
                    </button>
                </div>
            </GlassCard>

            {/* Editor Workspace */}
            <div className="flex-1 flex gap-4 min-h-0">
                {/* Canvas Area */}
                <div className="flex-1 glass-surface rounded-2xl border border-white/10 p-8 overflow-y-auto flex flex-col items-center">
                    <div className="text-center mt-20 text-slate-500 space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto animate-pulse" />
                        <p>Drag and drop actions here</p>
                    </div>
                </div>

                {/* Toolbar / Actions Panel */}
                <GlassCard className="w-80 flex-shrink-0 overflow-y-auto flex flex-col gap-4">
                    <h2 className="font-semibold text-sm uppercase tracking-wider text-slate-500">Available Actions</h2>

                    {/* Skeleton Actions */}
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 animate-pulse" />
                                <div className="h-4 w-1/2 bg-white/10 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}

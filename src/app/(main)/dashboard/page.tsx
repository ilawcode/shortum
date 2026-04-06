import { GlassCard } from "@/components/ui/GlassCard";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-slate-500 mt-2">Manage and monitor your shortcuts.</p>
                </div>
                <Link href="/editor" className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl transition-colors font-medium">
                    <PlusCircle size={20} />
                    Create Shortcut
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Skeleton cards for masonry / grid */}
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <GlassCard key={i} className="flex flex-col gap-4 h-64">
                        <div className="h-4 w-1/3 bg-white/10 rounded animate-pulse" />
                        <div className="h-8 w-2/3 bg-white/10 rounded animate-pulse mt-2" />
                        <div className="h-20 w-full bg-white/10 rounded animate-pulse mt-4" />

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                            <div className="h-4 w-1/4 bg-white/10 rounded animate-pulse" />
                            <div className="h-4 w-1/4 bg-white/10 rounded animate-pulse" />
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
}

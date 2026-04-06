"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Coins, Loader2 } from "lucide-react";
import { useState } from "react";
// import { createProjectWithCredit } from "@/lib/actions/project";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
    onConfirm: (projectId: string) => void;
}

export function CreditModal({ onConfirm }: Props) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleConfirm = async () => {
        setLoading(true);
        try {
            // In a real environment with auth ready, uncomment Server Action usage:
            // const projectId = await createProjectWithCredit();

            // Simulating network request for testing without supabase token
            await new Promise(resolve => setTimeout(resolve, 800));
            const fakeId = "proj_" + Math.random().toString(36).substring(7);

            toast.success("Project created! 1 credit consumed.");
            onConfirm(fakeId);
        } catch (err: any) {
            toast.error(err.message || "Failed to consume credit.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.push("/dashboard");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <GlassCard className="max-w-md w-full flex flex-col gap-6 text-center border border-white/10 shadow-2xl">
                <div className="mx-auto w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400">
                    <Coins size={32} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold">Start New Shortcut</h2>
                    <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                        Creating a new sequence requires server resources. Proceed to consume 1 credit from your balance.
                    </p>
                </div>
                <div className="flex items-center gap-3 mt-4">
                    <button
                        onClick={handleCancel}
                        disabled={loading}
                        className="flex-1 px-4 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-medium text-sm">
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="flex-1 px-4 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white transition-colors font-medium text-sm flex items-center justify-center">
                        {loading ? <Loader2 className="animate-spin" size={20} /> : "Consume 1 Credit"}
                    </button>
                </div>
            </GlassCard>
        </div>
    );
}

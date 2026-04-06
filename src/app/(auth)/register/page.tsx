"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Validate Disposable Email List
        const temporaryDomains = ['tempmail.com', '10minutemail.com'];
        if (temporaryDomains.some(d => email.includes(d))) {
            toast.error("Disposable emails are blocked by security policy.");
            setIsLoading(false);
            return;
        }

        const supabase = createClient();

        const { error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Account created successfully!");
            router.push("/dashboard");
        }

        setIsLoading(false);
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] md:min-h-screen p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <GlassCard className="w-full max-w-md p-8 flex flex-col gap-6 border border-white/10 shadow-2xl">
                <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-2">
                        <Lock size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Create Account</h1>
                    <p className="text-slate-400 text-sm">Initialize your credentials to start using ShortcutHub.</p>
                </div>

                <form onSubmit={handleRegister} className="flex flex-col gap-4 mt-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 focus:bg-black/40 transition-all"
                            placeholder="admin@shortcuthub.app"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Security Key (Password)</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 focus:bg-black/40 transition-all font-mono"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 border border-indigo-400/50 disabled:opacity-50 text-white font-medium transition-all shadow-lg shadow-indigo-500/20"
                    >
                        {isLoading ? "Creating Account..." : "Register & Initialize"}
                    </button>
                    
                    <p className="text-center text-slate-400 text-sm mt-4">
                        Already have an account? <Link href="/login" className="text-indigo-400 hover:text-indigo-300">Sign In</Link>
                    </p>
                </form>
            </GlassCard>
        </div>
    );
}

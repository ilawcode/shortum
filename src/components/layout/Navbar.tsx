"use client";

import Link from "next/link";
import { Menu, Zap } from "lucide-react";

export function Navbar() {
    return (
        <header className="md:hidden fixed top-0 w-full h-18 bg-white dark:bg-[#24303f] drop-shadow-1 z-50 flex items-center justify-between px-6 border-b border-[#e2e8f0] dark:border-[#313d4a]">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#3c50e0] flex items-center justify-center rounded-sm">
                    <Zap size={20} className="text-white" fill="white" />
                </div>
                <span className="font-black text-xl tracking-tighter text-[#1c2434] dark:text-white uppercase italic">Hub</span>
            </div>
            <div className="flex items-center gap-4">
                <button className="p-2 rounded-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-[#313d4a] text-slate-500 transition-colors">
                    <Menu size={22} strokeWidth={2.5} />
                </button>
            </div>
        </header>
    );
}

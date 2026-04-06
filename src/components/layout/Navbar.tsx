"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

export function Navbar() {
    return (
        <header className="md:hidden fixed top-0 w-full h-16 glass-surface z-50 flex items-center justify-between px-4 border-b border-white/10">
            <div className="font-bold text-xl tracking-tighter text-indigo-500">
                ShortcutHub
            </div>
            <button className="p-2 rounded-md hover:bg-slate-500/10 transition-colors">
                <Menu size={24} />
            </button>
        </header>
    );
}

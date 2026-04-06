"use client";

import Link from "next/link";
import { Home, Command, PlusCircle, Settings, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NotificationWidget } from "./NotificationWidget";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/editor", label: "New Shortcut", icon: PlusCircle },
    { href: "/shortcuts", label: "My Shortcuts", icon: Command },
    { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 glass-surface border-r border-white/10 flex flex-col hidden md:flex z-50">
            <div className="p-6 font-bold text-2xl tracking-tighter text-indigo-500 flex items-center justify-between">
                <span>ShortcutHub</span>
                <NotificationWidget />
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                                isActive
                                    ? "bg-indigo-500/10 text-indigo-500 font-medium"
                                    : "hover:bg-slate-500/10 text-slate-500 dark:text-slate-400 hover:text-foreground"
                            )}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto border-t border-white/10">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-500/10 transition-all text-slate-500 dark:text-slate-400 hover:text-foreground">
                    <User size={20} />
                    <span>Profile / Auth</span>
                </button>
            </div>
        </aside>
    );
}

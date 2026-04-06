"use client";

import Link from "next/link";
import { Home, Command, PlusCircle, Settings, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/editor", label: "Editor Hub", icon: PlusCircle },
    { href: "/shortcuts", label: "Shared Area", icon: Command },
    { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
    <aside className="w-72 h-screen fixed left-0 top-0 bg-[#1c2434] text-[#dee4ee] flex flex-col hidden md:flex z-50">
            <div className="p-7.5 px-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#3c50e0] flex items-center justify-center rounded-lg shadow-lg">
                    <span className="text-white font-black text-2xl tracking-tighter">S</span>
                </div>
                <span className="font-black text-2xl tracking-tighter text-white uppercase italic">Hub</span>
            </div>

            <nav className="flex-1 px-4 mt-5">
                <p className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#8a99af]">Menu</p>
                <div className="space-y-1.5 font-medium">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-6 py-4 rounded-sm transition-all duration-300",
                                isActive
                                    ? "bg-[#333a48] text-white"
                                    : "text-[#8a99af] hover:text-white hover:bg-[#333a48]"
                            )}
                        >
                            <Icon size={18} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
                </div>
            </nav>

            <div className="p-4 mt-auto border-t border-[#313d4a]">
                <button className="w-full flex items-center gap-3 px-6 py-4 text-[#8a99af] hover:text-white transition-all font-medium">
                    <User size={18} />
                    <span>Profile / Auth</span>
                </button>
            </div>
        </aside>
    );
}

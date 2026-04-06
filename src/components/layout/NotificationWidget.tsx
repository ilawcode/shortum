"use client";

import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Notification {
    id: string;
    type: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

export function NotificationWidget() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        let channel: any;

        const initNotifications = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return; // Silent return if not logged in

            const { data } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(5);

            if (data) setNotifications(data);

            channel = supabase.channel('realtime_notifications')
                .on(
                    'postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
                    (payload) => {
                        const newNotif = payload.new as Notification;
                        setNotifications(prev => [newNotif, ...prev].slice(0, 5));
                        toast.info("New Notification", {
                            description: newNotif.message,
                        });
                    }
                )
                .subscribe();
        };

        initNotifications();

        return () => {
            if (channel) supabase.removeChannel(channel);
        };
    }, [supabase]);

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl hover:bg-slate-500/10 transition-colors relative text-slate-500 hover:text-foreground"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 glass-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100]">
                    <div className="p-4 border-b border-white/10 font-medium">Notifications</div>
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-sm text-slate-500 text-center">No notifications</div>
                        ) : (
                            notifications.map((n) => (
                                <div key={n.id} className={cn("p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-pointer", !n.is_read && "bg-white/5")}>
                                    <p className="text-sm text-slate-200">{n.message}</p>
                                    <p className="text-xs text-slate-500 mt-2">{new Date(n.created_at).toLocaleDateString()}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

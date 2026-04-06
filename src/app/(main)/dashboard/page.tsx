"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { Shortcut } from "@/store/useEditorStore";
import { Loader2, Plus, Zap, Pencil, Trash2, Share2, Search, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchShortcuts();
  }, []);

  const fetchShortcuts = async () => {
    try {
      const { data, error } = await supabase
        .from("shortcuts")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setShortcuts(data || []);
    } catch (e: any) {
      toast.error("Failed to load shortcuts");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (shortcut: Shortcut) => {
    router.push(`/editor?id=${shortcut.id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this shortcut?")) return;
    setDeletingId(id);
    try {
      const { error } = await supabase.from("shortcuts").delete().eq("id", id);
      if (error) throw error;
      setShortcuts((prev) => prev.filter((s) => s.id !== id));
      toast.success("Shortcut deleted");
    } catch (e: any) {
      toast.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublic = async (shortcut: Shortcut) => {
    try {
      const { error } = await supabase
        .from("shortcuts")
        .update({ is_public: !shortcut.is_public })
        .eq("id", shortcut.id);

      if (error) throw error;
      setShortcuts((prev) =>
        prev.map((s) => (s.id === shortcut.id ? { ...s, is_public: !s.is_public } : s))
      );
      toast.success(shortcut.is_public ? "Shortcut is now private" : "Shortcut is now public");
    } catch (e: any) {
      toast.error("Toggle visibility failed");
    }
  };

  const copyShareLink = (shortcut: Shortcut) => {
    const url = `${window.location.origin}/api/s/${shortcut.id}`;
    navigator.clipboard.writeText(url);
    toast.success("External API link copied!");
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(date).toLocaleDateString();
  };

  const filteredShortcuts = shortcuts.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-[#f1f5f9] dark:bg-[#1c2434] min-h-screen">
      {/* Page Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-[#1c2434] dark:text-white uppercase tracking-tighter">Your Shortcut Factory</h1>
          <p className="text-[#8a99af] font-medium text-sm mt-1 uppercase tracking-widest text-[10px]">Manage and simulate your automation hub</p>
        </div>
        <button
          onClick={() => router.push("/editor")}
          className="flex items-center gap-2 bg-[#3c50e0] py-4 px-10 rounded-sm font-black text-white hover:bg-opacity-90 transition-all uppercase tracking-wider text-sm shadow-lg shadow-indigo-500/20 group"
        >
          <Plus size={20} strokeWidth={3} className="group-hover:scale-125 transition-transform" /> 
          Spawn New Shortcut
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="panel-card bg-white dark:bg-[#24303f] p-4 mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a99af]" />
            <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shortcuts..."
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-sm pl-12 pr-4 py-3 text-[#1c2434] dark:text-[#dee4ee] font-medium outline-none focus:ring-2 focus:ring-[#3c50e0]/10 transition-all"
            />
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-white dark:bg-[#24303f] border border-[#e2e8f0] dark:border-[#313d4a] px-6 py-3 rounded-sm font-bold text-slate-500 hover:text-[#3c50e0] transition-all text-sm uppercase tracking-wider">
                <Filter size={16} /> Filter
            </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <Loader2 className="animate-spin text-[#3c50e0]" size={48} />
          <p className="text-[#8a99af] font-black uppercase tracking-widest text-xs">Loading Factory Assets...</p>
        </div>
      ) : filteredShortcuts.length === 0 ? (
        <div className="panel-card bg-white dark:bg-[#24303f] py-32 text-center flex flex-col items-center border-dashed border-2 border-[#e2e8f0] dark:border-[#313d4a]">
          <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-8">
            <Zap size={48} className="text-[#3c50e0]" />
          </div>
          <h2 className="text-2xl font-black text-[#1c2434] dark:text-white uppercase mb-2">No Shortcuts Found</h2>
          <p className="text-slate-500 max-w-sm mb-8 font-medium">Start your first automation process by spawning a new shortcut from the editor.</p>
          <button
            onClick={() => router.push("/editor")}
            className="bg-[#3c50e0] py-4 px-10 rounded-sm font-black text-white hover:bg-opacity-90 transition-all uppercase tracking-wider text-sm shadow-lg shadow-indigo-500/20"
          >
            Create New Process
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredShortcuts.map((sc) => (
            <div
              key={sc.id}
              className="group panel-card bg-white dark:bg-[#24303f] flex flex-col overflow-hidden hover:translate-y-[-4px] duration-300"
            >
              <div className="p-8 pb-4 flex flex-col items-center text-center">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl mb-6 shadow-xl transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${sc.color ?? "#3c50e0"}15`, color: sc.color ?? "#3c50e0" }}
                  >
                    {sc.icon ?? "⚡"}
                  </div>
                  <h3 className="font-black text-[#1c2434] dark:text-white text-xl uppercase tracking-tighter truncate w-full group-hover:text-[#3c50e0] transition-colors">
                    {sc.title}
                  </h3>
                  <p className="text-sm font-bold text-[#8a99af] line-clamp-2 mt-3 leading-relaxed min-h-[2.5rem]">
                    {sc.description || "No process description provided for this shortcut."}
                  </p>
              </div>

              {/* Stats & Metadata */}
              <div className="px-8 py-4 bg-slate-50 dark:bg-[#24303f] border-y border-[#e2e8f0] dark:border-[#313d4a] flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-2 text-[#3c50e0]">
                  <Zap size={14} fill="currentColor" />
                  {sc.content_json?.length ?? 0} Steps
                </div>
                <div className="text-[#8a99af]">
                  {timeAgo(sc.updated_at)}
                </div>
              </div>

              {/* Action Strip - TailAdmin Style Bottom Bar */}
              <div className="p-4 bg-white dark:bg-[#24303f] flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(sc)}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#f1f5f9] dark:bg-slate-800 text-[#1c2434] dark:text-white py-2.5 px-4 rounded-sm font-black text-[10px] uppercase tracking-wider hover:bg-[#3c50e0] hover:text-white transition-all transition-duration-300 shadow-sm"
                  >
                    <Pencil size={12} strokeWidth={3} /> Launch
                  </button>
                  <button
                    onClick={() => handleTogglePublic(sc)}
                    className={cn(
                      "flex items-center justify-center p-2.5 rounded-sm transition-all border",
                      sc.is_public
                        ? "text-emerald-600 bg-emerald-50 border-emerald-100 hover:bg-emerald-100"
                        : "text-[#8a99af] bg-slate-50 border-[#e2e8f0] hover:text-[#1c2434]"
                    )}
                    title={sc.is_public ? "Public" : "Private"}
                  >
                    <Share2 size={16} strokeWidth={3} />
                  </button>
                  <button
                    onClick={() => handleDelete(sc.id)}
                    disabled={deletingId === sc.id}
                    className="flex items-center justify-center p-2.5 rounded-sm bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                  >
                    {deletingId === sc.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} strokeWidth={3} />
                    )}
                  </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

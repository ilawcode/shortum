"use client";

import { useEffect, useState } from "react";
import { PlusCircle, Pencil, Trash2, Share2, Loader2, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEditorStore } from "@/store/useEditorStore";
import { cn } from "@/lib/utils";

interface Shortcut {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  content_json: any[];
  is_public: boolean;
  download_count: number;
  created_at: string;
  updated_at: string;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function DashboardPage() {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const { loadShortcut, resetEditor } = useEditorStore();

  const fetchShortcuts = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("shortcuts")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      toast.error("Could not load shortcuts");
    } else {
      setShortcuts(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchShortcuts();
  }, []);

  const handleEdit = (sc: Shortcut) => {
    loadShortcut(sc.id, sc.title, sc.icon, sc.description, sc.content_json);
    router.push("/editor");
  };

  const handleNew = () => {
    resetEditor();
    router.push("/editor");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this shortcut? This cannot be undone.")) return;
    setDeletingId(id);
    const supabase = createClient();
    const { error } = await supabase.from("shortcuts").delete().eq("id", id);
    if (error) {
      toast.error("Delete failed");
    } else {
      toast.success("Shortcut deleted");
      setShortcuts((prev) => prev.filter((s) => s.id !== id));
    }
    setDeletingId(null);
  };

  const handleTogglePublic = async (sc: Shortcut) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("shortcuts")
      .update({ is_public: !sc.is_public })
      .eq("id", sc.id);
    if (error) {
      toast.error("Update failed");
    } else {
      toast.success(sc.is_public ? "Shortcut set to private" : "Shortcut is now public");
      setShortcuts((prev) =>
        prev.map((s) => (s.id === sc.id ? { ...s, is_public: !s.is_public } : s))
      );
    }
  };

  const copyShareLink = (sc: Shortcut) => {
    const url = `${window.location.origin}/api/s/${sc.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Share link copied!");
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="text-slate-500 mt-1">
            {loading ? "Loading..." : `${shortcuts.length} shortcut${shortcuts.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl transition-colors font-medium shadow-lg shadow-indigo-500/20"
        >
          <PlusCircle size={18} />
          New Shortcut
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-52 rounded-2xl bg-white/5 animate-pulse border border-white/5"
            />
          ))}
        </div>
      ) : shortcuts.length === 0 ? (
        // Empty State
        <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-4xl">
            ⚡
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">No shortcuts yet</h2>
            <p className="text-slate-500 mt-2 max-w-sm">
              Build your first iOS shortcut using our visual editor with 80+ available actions.
            </p>
          </div>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl transition-colors font-medium"
          >
            <PlusCircle size={18} />
            Create Your First Shortcut
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shortcuts.map((sc) => (
            <div
              key={sc.id}
              className="group relative bg-slate-900/50 hover:bg-slate-900/80 border border-white/10 hover:border-indigo-500/50 rounded-2xl p-6 flex flex-col gap-5 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/10"
              onClick={() => handleEdit(sc)}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-inner"
                    style={{ backgroundColor: `${sc.color ?? "#6366f1"}30` }}
                  >
                    {sc.icon ?? "⚡"}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-100 text-lg truncate group-hover:text-white transition-colors">{sc.title}</h3>
                    <p className="text-sm text-slate-400 truncate mt-1 leading-relaxed">
                      {sc.description || "No description"}
                    </p>
                  </div>
                </div>
                {sc.is_public && (
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-lg flex-shrink-0">
                    Public
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Zap size={14} className="text-indigo-400" />
                  {sc.content_json?.length ?? 0} actions
                </span>
                <span className="text-slate-500">{timeAgo(sc.updated_at)}</span>
                {sc.download_count > 0 && (
                  <span className="text-slate-400">{sc.download_count} downloads</span>
                )}
              </div>

              {/* Action Strip */}
              <div
                className="flex items-center gap-2 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => handleEdit(sc)}
                  className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl transition-all"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  onClick={() => handleTogglePublic(sc)}
                  className={cn(
                    "flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition-all",
                    sc.is_public
                      ? "text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"
                      : "text-slate-300 hover:text-white bg-white/5 hover:bg-white/10"
                  )}
                >
                  <Share2 size={14} />
                  {sc.is_public ? "Private" : "Public"}
                </button>
                {sc.is_public && (
                  <button
                    onClick={() => copyShareLink(sc)}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl transition-all"
                  >
                    Copy API
                  </button>
                )}
                <button
                  onClick={() => handleDelete(sc.id)}
                  disabled={deletingId === sc.id}
                  className="ml-auto flex items-center gap-2 text-xs font-semibold text-red-400/80 hover:text-red-400 bg-red-500/5 hover:bg-red-500/10 px-4 py-2 rounded-xl transition-all disabled:opacity-50"
                >
                  {deletingId === sc.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

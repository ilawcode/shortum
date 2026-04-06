"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEditorStore } from "@/store/useEditorStore";
import { ActionCard } from "@/components/editor/ActionCard";
import { SimulatorModal } from "@/components/editor/SimulatorModal";
import { useState, useMemo } from "react";
import {
  Check,
  Play,
  Search,
  ChevronDown,
  ChevronRight,
  Loader2,
  Pencil,
  Zap,
} from "lucide-react";
import {
  ACTIONS_LIBRARY,
  ACTION_CATEGORIES,
  ActionDefinition,
} from "@/lib/actions-library";
import { createClient } from "@/lib/supabase-client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

const ICON_OPTIONS = ["⚡", "🚀", "🎯", "🔧", "🌐", "📱", "🔔", "📸", "🗺️", "🎵", "🤖", "✨", "🔐", "📊", "💡", "🎮"];

export default function EditorPage() {
  const {
    actions,
    errors,
    shortcutId,
    shortcutTitle,
    shortcutIcon,
    shortcutDescription,
    isDirty,
    addActionFromDefinition,
    reorderActions,
    setShortcutId,
    setShortcutTitle,
    setShortcutIcon,
    setShortcutDescription,
  } = useEditorStore();

  const [showSimulator, setShowSimulator] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["scripting"]));
  const [isSaving, setIsSaving] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderActions(active.id as string, over.id as string);
    }
  };

  const filteredActions = useMemo(() => {
    let list = ACTIONS_LIBRARY;
    if (selectedCategory) list = list.filter((a) => a.category === selectedCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.label.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [searchQuery, selectedCategory]);

  const groupedActions = useMemo(() => {
    const grouped: Record<string, ActionDefinition[]> = {};
    for (const action of filteredActions) {
      if (!grouped[action.category]) grouped[action.category] = [];
      grouped[action.category].push(action);
    }
    return grouped;
  }, [filteredActions]);

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  };

  const handleSave = async (silent = false) => {
    if (actions.length === 0) {
      toast.error("Add at least one action first");
      return false;
    }
    setIsSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error("Not authenticated"); return false; }

      const payload = {
        user_id: user.id,
        title: shortcutTitle,
        icon: shortcutIcon,
        description: shortcutDescription,
        content_json: actions,
        updated_at: new Date().toISOString(),
      };

      if (shortcutId) {
        const { error } = await supabase.from("shortcuts").update(payload).eq("id", shortcutId);
        if (error) throw error;
        if (!silent) toast.success("Shortcut updated!");
      } else {
        const { data, error } = await supabase.from("shortcuts").insert(payload).select("id").single();
        if (error) throw error;
        setShortcutId(data.id);
        if (!silent) toast.success("Shortcut saved!");
      }
      return true;
    } catch (e: any) {
      toast.error(e.message ?? "Save failed");
      return false;
    } finally {
      setIsSaving(true); // Keep spinner until we explicitly clear or wait for state sync
      setTimeout(() => setIsSaving(false), 500);
    }
  };

  const handlePreviewClick = () => {
    if (isDirty) {
        setShowSaveConfirm(true);
    } else {
        setShowSimulator(true);
    }
  };

  const handleConfirmSaveAndPreview = async () => {
    const success = await handleSave(true);
    if (success) {
        setShowSimulator(true);
    }
  };

  const hasErrors = Object.keys(errors).length > 0;
  const isSaveDisabled = actions.length === 0 || hasErrors || isSaving;

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-[#f1f5f9] dark:bg-[#1c2434]">
      {/* TailAdmin Header */}
      <header className="sticky top-0 z-40 flex w-full bg-white dark:bg-[#24303f] drop-shadow-1 dark:drop-shadow-none border-b border-[#e2e8f0] dark:border-[#313d4a] px-6 py-4 flex-shrink-0">
        <div className="flex flex-grow items-center justify-between">
          <div className="flex items-center gap-4">
             {/* Icon Picker */}
            <div className="relative">
                <button
                onClick={() => setShowIconPicker((v) => !v)}
                className="text-2xl w-11 h-11 rounded-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 flex items-center justify-center hover:bg-slate-100 transition-all shadow-sm"
                >
                {shortcutIcon}
                </button>
                {showIconPicker && (
                <div className="absolute top-14 left-0 z-50 bg-white dark:bg-[#24303f] border border-[#e2e8f0] dark:border-[#313d4a] rounded-sm p-4 grid grid-cols-4 gap-3 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                    {ICON_OPTIONS.map((icon) => (
                    <button
                        key={icon}
                        onClick={() => { setShortcutIcon(icon); setShowIconPicker(false); }}
                        className="w-10 h-10 text-xl flex items-center justify-center rounded-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        {icon}
                    </button>
                    ))}
                </div>
                )}
            </div>

            <div className="flex flex-col">
                {editingTitle ? (
                    <input
                    autoFocus
                    value={shortcutTitle}
                    onChange={(e) => setShortcutTitle(e.target.value)}
                    onBlur={() => setEditingTitle(false)}
                    onKeyDown={(e) => e.key === "Enter" && setEditingTitle(false)}
                    className="bg-transparent border-b-2 border-[#3c50e0] text-xl font-black text-[#1c2434] dark:text-white outline-none"
                    />
                ) : (
                    <button
                    onClick={() => setEditingTitle(true)}
                    className="flex items-center gap-2 text-xl font-black text-[#1c2434] dark:text-white hover:text-[#3c50e0] transition-colors"
                    >
                    {shortcutTitle}
                    <Pencil size={16} className="text-slate-400" />
                    </button>
                )}
                <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#3c50e0] bg-[#3c50e0]/10 px-2 py-0.5 rounded-sm">
                        {actions.length} Actions
                    </span>
                    {isDirty && <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" /> Unsaved
                    </span>}
                </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
                onClick={handlePreviewClick}
                disabled={actions.length === 0}
                className="flex items-center gap-2 rounded-sm border border-[#e2e8f0] dark:border-[#313d4a] py-2.5 px-6 font-bold text-[#1c2434] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-all text-sm uppercase tracking-wider"
            >
                <Play size={16} fill="currentColor" /> Preview
            </button>
            <button
                onClick={() => handleSave()}
                disabled={isSaveDisabled}
                className="flex items-center gap-2 rounded-sm bg-[#3c50e0] py-2.5 px-6 font-bold text-white hover:bg-opacity-90 disabled:opacity-50 transition-all text-sm uppercase tracking-wider shadow-lg shadow-indigo-500/20"
            >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={18} strokeWidth={3} />}
                {isSaving ? "Saving..." : "Publish"}
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        {/* Main Canvas Area */}
        <div className="flex-1 overflow-y-auto px-6 py-10">
          <div className="max-w-3xl mx-auto space-y-8">
             {/* Description Panel */}
            <div className="panel-card p-6 bg-white dark:bg-[#24303f]">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-[#8a99af] mb-3 block">Shortcut Description</label>
                <textarea
                    value={shortcutDescription}
                    onChange={(e) => setShortcutDescription(e.target.value)}
                    placeholder="Enter what this shortcut does for future reference..."
                    className="w-full bg-transparent border-none text-[#1c2434] dark:text-[#dee4ee] font-medium outline-none resize-none h-16 placeholder:text-slate-400"
                />
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={actions} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-6 pb-40">
                    {actions.length === 0 ? (
                    <div className="panel-card bg-white dark:bg-[#24303f] p-20 text-center flex flex-col items-center justify-center border-dashed border-2 border-[#e2e8f0] dark:border-[#313d4a]">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                            <Zap size={40} className="text-[#3c50e0]" />
                        </div>
                        <h3 className="text-xl font-bold text-[#1c2434] dark:text-white mb-2">Build Your Workflow</h3>
                        <p className="text-slate-500 text-sm max-w-sm">Select actions from the library panel on the right to start creating your shortcut factory.</p>
                    </div>
                    ) : (
                    actions.map((action) => (
                        <ActionCard key={action.id} action={action} />
                    ))
                    )}
                </div>
                </SortableContext>
            </DndContext>
          </div>
        </div>

        {/* Action Library - TailAdmin Styled Sidebar */}
        <div className="w-80 xl:w-96 flex-shrink-0 flex flex-col bg-white dark:bg-[#24303f] border-l border-[#e2e8f0] dark:border-[#313d4a]">
            <div className="p-6 border-b border-[#e2e8f0] dark:border-[#313d4a]">
                <h2 className="text-lg font-black text-[#1c2434] dark:text-white uppercase tracking-tighter mb-4">Action Library</h2>
                <div className="relative">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a99af]" />
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Filter tools..."
                        className="w-full bg-[#f1f5f9] dark:bg-slate-800 border-none rounded-sm pl-11 pr-4 py-3 text-sm text-[#1c2434] dark:text-[#dee4ee] outline-none focus:ring-2 focus:ring-[#3c50e0]/20 transition-all"
                    />
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 p-4 bg-slate-50 dark:bg-[#1a222c] border-b border-[#e2e8f0] dark:border-[#313d4a]">
                <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                    "px-3 py-1.5 rounded-sm text-xs font-bold transition-all uppercase tracking-wider",
                    selectedCategory === null
                    ? "bg-[#3c50e0] text-white"
                    : "bg-white dark:bg-[#24303f] border border-[#e2e8f0] dark:border-[#313d4a] text-slate-500 hover:text-[#3c50e0]"
                )}
                >
                All
                </button>
                {ACTION_CATEGORIES.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                    className={cn(
                        "px-3 py-1.5 rounded-sm text-xs font-bold transition-all uppercase tracking-wider border",
                        selectedCategory === cat.id
                        ? "text-white shadow-sm"
                        : "bg-white dark:bg-[#24303f] border-[#e2e8f0] dark:border-[#313d4a] text-slate-500 hover:text-[#3c50e0]"
                    )}
                    style={selectedCategory === cat.id ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
                >
                    {cat.label}
                </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide py-2">
                {Object.entries(groupedActions).map(([catId, catActions]) => {
                const category = ACTION_CATEGORIES.find((c) => c.id === catId);
                const isExpanded = expandedCategories.has(catId) || !!searchQuery;
                return (
                    <div key={catId}>
                    <button
                        onClick={() => toggleCategory(catId)}
                        className="w-full flex items-center justify-between px-6 py-4 text-xs font-black text-[#8a99af] uppercase tracking-[0.2em] hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                        <span>{category?.label ?? catId}</span>
                        <div className="flex items-center gap-3">
                        <span className="text-slate-400 font-bold">{catActions.length}</span>
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </div>
                    </button>
                    {isExpanded && (
                        <div className="bg-slate-50/50 dark:bg-black/5 divide-y divide-white/5">
                        {catActions.map((action) => (
                            <button
                            key={action.type}
                            onClick={() => addActionFromDefinition(action)}
                            className="w-full flex items-center gap-4 px-6 py-5 hover:bg-white dark:hover:bg-[#333a48] transition-all text-left group border-l-4 border-transparent hover:border-[#3c50e0]"
                            >
                            <span className="text-2xl w-10 h-10 bg-white dark:bg-slate-800 rounded-sm flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
                                {action.icon}
                            </span>
                            <div className="min-w-0">
                                <div className="text-sm font-bold text-[#1c2434] dark:text-white truncate">
                                {action.label}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-[#8a99af] truncate mt-0.5">
                                {action.description}
                                </div>
                            </div>
                            </button>
                        ))}
                        </div>
                    )}
                    </div>
                );
                })}
            </div>
        </div>
      </div>

      {showSimulator && shortcutId && (
        <SimulatorModal
          shortcutId={shortcutId}
          onClose={() => setShowSimulator(false)}
        />
      )}

      <ConfirmationModal
        isOpen={showSaveConfirm}
        onClose={() => setShowSaveConfirm(false)}
        onConfirm={handleConfirmSaveAndPreview}
        title="Unsaved Changes"
        message="Simulating requires the latest version of your shortcut. Would you like to save your changes and start the simulation?"
        confirmLabel="Save & Preview"
        cancelLabel="Discard Changes"
        isDanger={false}
      />
    </div>
  );
}

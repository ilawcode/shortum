"use client";

import { GlassCard } from "@/components/ui/GlassCard";
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
} from "lucide-react";
import {
  ACTIONS_LIBRARY,
  ACTION_CATEGORIES,
  ActionDefinition,
} from "@/lib/actions-library";
import { createClient } from "@/lib/supabase-client";
import { toast } from "sonner";

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

  const handleSave = async () => {
    if (actions.length === 0) {
      toast.error("Add at least one action first");
      return;
    }
    setIsSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error("Not authenticated"); return; }

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
        toast.success("Shortcut updated!");
      } else {
        const { data, error } = await supabase.from("shortcuts").insert(payload).select("id").single();
        if (error) throw error;
        setShortcutId(data.id);
        toast.success("Shortcut saved!");
      }
    } catch (e: any) {
      toast.error(e.message ?? "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const hasErrors = Object.keys(errors).length > 0;
  const isSaveDisabled = actions.length === 0 || hasErrors || isSaving;

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-background/50 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Icon Picker */}
          <div className="relative">
            <button
              onClick={() => setShowIconPicker((v) => !v)}
              className="text-2xl w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center hover:bg-indigo-500/30 transition-colors"
            >
              {shortcutIcon}
            </button>
            {showIconPicker && (
              <div className="absolute top-12 left-0 z-50 bg-slate-900 border border-white/10 rounded-xl p-3 grid grid-cols-4 gap-2 shadow-2xl">
                {ICON_OPTIONS.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => { setShortcutIcon(icon); setShowIconPicker(false); }}
                    className="w-9 h-9 text-xl flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                  >
                    {icon}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Editable Title */}
          {editingTitle ? (
            <input
              autoFocus
              value={shortcutTitle}
              onChange={(e) => setShortcutTitle(e.target.value)}
              onBlur={() => setEditingTitle(false)}
              onKeyDown={(e) => e.key === "Enter" && setEditingTitle(false)}
              className="bg-transparent border-b border-indigo-500 text-lg font-semibold text-white outline-none px-1"
            />
          ) : (
            <button
              onClick={() => setEditingTitle(true)}
              className="flex items-center gap-2 text-lg font-semibold text-white hover:text-indigo-300 transition-colors"
            >
              {shortcutTitle}
              <Pencil size={14} className="text-slate-500" />
            </button>
          )}

          <span className="text-xs text-slate-500 bg-white/5 rounded-full px-2 py-0.5">
            {actions.length} action{actions.length !== 1 ? "s" : ""}
          </span>
          {isDirty && <span className="text-xs text-amber-400">● Unsaved</span>}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSimulator(true)}
            disabled={actions.length === 0}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-500/20 hover:bg-slate-500/30 disabled:opacity-40 text-white transition-colors flex items-center gap-2"
          >
            <Play size={16} /> Simulate
          </button>
          <button
            onClick={handleSave}
            disabled={isSaveDisabled}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors flex items-center gap-2"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            {isSaving ? "Saving..." : "Save Shortcut"}
          </button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Canvas */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Description Input */}
          <input
            value={shortcutDescription}
            onChange={(e) => setShortcutDescription(e.target.value)}
            placeholder="Add a short description (optional)..."
            className="w-full max-w-2xl mx-auto block mb-6 bg-transparent border-b border-white/20 text-slate-200 text-sm outline-none pb-1 focus:border-indigo-500 transition-colors placeholder:text-slate-500"
          />

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={actions} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-4 max-w-2xl mx-auto pb-32">
                {actions.length === 0 ? (
                  <div className="text-center mt-32 text-slate-500 space-y-4">
                    <div className="text-6xl">⚡</div>
                    <p className="text-lg font-medium text-slate-400">Your canvas is empty</p>
                    <p className="text-sm">Browse the action library on the right and click to add actions.</p>
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

        {/* Action Library Panel */}
        <div className="w-72 xl:w-80 flex-shrink-0 flex flex-col border-l border-white/5 bg-background/30">
          {/* Search */}
          <div className="p-4 border-b border-white/5">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search actions..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500 transition-all placeholder:text-slate-500 shadow-inner"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="px-4 py-2 flex gap-2 overflow-x-auto border-b border-white/5 flex-shrink-0">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === null
                  ? "bg-indigo-500 text-white"
                  : "bg-white/5 text-slate-400 hover:bg-white/10"
              }`}
            >
              All
            </button>
            {ACTION_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? "text-white"
                    : "bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
                style={selectedCategory === cat.id ? { backgroundColor: cat.color } : {}}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {/* Grouped Action List */}
          <div className="flex-1 overflow-y-auto">
            {Object.entries(groupedActions).map(([catId, catActions]) => {
              const category = ACTION_CATEGORIES.find((c) => c.id === catId);
              const isExpanded = expandedCategories.has(catId) || !!searchQuery;
              return (
                <div key={catId}>
                  <button
                    onClick={() => toggleCategory(catId)}
                    className="w-full flex items-center justify-between px-4 py-3 text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] hover:bg-white/5 transition-colors"
                  >
                    <span>
                      {category?.icon} {category?.label ?? catId}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 normal-case font-medium">
                        {catActions.length}
                      </span>
                      {isExpanded ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      )}
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="pb-2">
                      {catActions.map((action) => (
                        <button
                          key={action.type}
                          onClick={() => addActionFromDefinition(action)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all text-left group border-l-2 border-transparent hover:border-indigo-500"
                        >
                          <span className="text-xl w-7 text-center flex-shrink-0">
                            {action.icon}
                          </span>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-slate-100 group-hover:text-white transition-colors truncate">
                              {action.label}
                            </div>
                            <div className="text-[11px] text-slate-400 group-hover:text-slate-300 truncate mt-0.5">
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
            {Object.keys(groupedActions).length === 0 && (
              <div className="text-center py-12 text-slate-500 text-sm">
                No actions found
              </div>
            )}
          </div>
        </div>
      </div>

      {showSimulator && shortcutId && (
        <SimulatorModal
          shortcutId={shortcutId}
          onClose={() => setShowSimulator(false)}
        />
      )}
    </div>
  );
}

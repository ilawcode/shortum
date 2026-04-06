import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { ActionDefinition } from '@/lib/actions-library';

export interface ActionParam {
  name: string;
  value: string;
  type: string; // 'variable', 'text', 'boolean', 'select', 'number', 'url', 'textarea'
}

export interface ShortcutAction {
  id: string;
  type: string;
  icon: string;
  label: string;
  params: ActionParam[];
  outputType?: string;
  outputName?: string;
}

export interface Shortcut {
  id: string;
  title: string;
  icon: string;
  description: string;
  color?: string;
  content_json: ShortcutAction[];
  is_public: boolean;
  download_count: number;
  updated_at: string;
}

interface EditorState {
  actions: ShortcutAction[];
  errors: Record<string, string>;
  shortcutId: string | null;
  shortcutTitle: string;
  shortcutIcon: string;
  shortcutDescription: string;
  isDirty: boolean;

  addActionFromDefinition: (def: ActionDefinition) => void;
  removeAction: (id: string) => void;
  updateActionParam: (actionId: string, paramName: string, value: string) => void;
  reorderActions: (activeId: string, overId: string) => void;
  validateSequence: () => void;
  setShortcutId: (id: string) => void;
  setShortcutTitle: (title: string) => void;
  setShortcutIcon: (icon: string) => void;
  setShortcutDescription: (desc: string) => void;
  loadShortcut: (id: string, title: string, icon: string, description: string, actions: ShortcutAction[]) => void;
  resetEditor: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  actions: [],
  errors: {},
  shortcutId: null,
  shortcutTitle: 'Untitled Shortcut',
  shortcutIcon: '⚡',
  shortcutDescription: '',
  isDirty: false,

  addActionFromDefinition: (def) => {
    const newAction: ShortcutAction = {
      id: nanoid(),
      type: def.type,
      label: def.label,
      icon: def.icon,
      outputType: def.outputType,
      params: def.params.map((p) => ({
        name: p.name,
        value: p.defaultValue ?? '',
        type: p.type,
      })),
    };
    set((state) => ({ actions: [...state.actions, newAction], isDirty: true }));
    get().validateSequence();
  },

  removeAction: (id) => {
    set((state) => ({
      actions: state.actions.filter((a) => a.id !== id),
      isDirty: true,
    }));
    get().validateSequence();
  },

  updateActionParam: (actionId, paramName, value) => {
    set((state) => ({
      actions: state.actions.map((a) =>
        a.id === actionId
          ? { ...a, params: a.params.map((p) => (p.name === paramName ? { ...p, value } : p)) }
          : a
      ),
      isDirty: true,
    }));
    get().validateSequence();
  },

  reorderActions: (activeId, overId) => {
    set((state) => {
      const oldIndex = state.actions.findIndex((a) => a.id === activeId);
      const newIndex = state.actions.findIndex((a) => a.id === overId);
      if (oldIndex === -1 || newIndex === -1) return state;
      const newActions = [...state.actions];
      const [moved] = newActions.splice(oldIndex, 1);
      newActions.splice(newIndex, 0, moved);
      return { actions: newActions, isDirty: true };
    });
    get().validateSequence();
  },

  validateSequence: () => {
    const { actions } = get();
    const newErrors: Record<string, string> = {};
    actions.forEach((action) => {
      for (const param of action.params) {
        if (param.type !== 'boolean' && !param.value.trim()) {
          // Only required params trigger errors — check if type is not boolean (always has a value)
        }
      }
    });
    set({ errors: newErrors });
  },

  setShortcutId: (id) => set({ shortcutId: id }),
  setShortcutTitle: (title) => set({ shortcutTitle: title, isDirty: true }),
  setShortcutIcon: (icon) => set({ shortcutIcon: icon, isDirty: true }),
  setShortcutDescription: (desc) => set({ shortcutDescription: desc, isDirty: true }),

  loadShortcut: (id, title, icon, description, actions) => {
    set({ shortcutId: id, shortcutTitle: title, shortcutIcon: icon, shortcutDescription: description, actions, errors: {}, isDirty: false });
  },

  resetEditor: () => {
    set({ actions: [], errors: {}, shortcutId: null, shortcutTitle: 'Untitled Shortcut', shortcutIcon: '⚡', shortcutDescription: '', isDirty: false });
  },
}));

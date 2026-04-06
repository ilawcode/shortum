import { create } from 'zustand';
import { nanoid } from 'nanoid';

export interface ActionParam {
    name: string;
    value: string;
    type: string; // 'variable', 'text', 'boolean'
}

export interface ShortcutAction {
    id: string; // instance id for dnd
    type: string; // e.g. com.apple.shortcuts.scripting.text
    icon: string;
    label: string;
    params: ActionParam[];
    outputType?: string;
    outputName?: string;
}

interface EditorState {
    actions: ShortcutAction[];
    errors: Record<string, string>; // actionId -> error message
    addAction: (actionTemplate: Omit<ShortcutAction, 'id'>) => void;
    removeAction: (id: string) => void;
    updateActionParam: (actionId: string, paramName: string, value: string) => void;
    reorderActions: (activeId: string, overId: string) => void;
    validateSequence: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
    actions: [],
    errors: {},

    addAction: (actionTemplate) => {
        const newAction = { ...actionTemplate, id: nanoid() };
        set((state) => {
            const newActions = [...state.actions, newAction];
            return { actions: newActions };
        });
        get().validateSequence();
    },

    removeAction: (id) => {
        set((state) => ({ actions: state.actions.filter(a => a.id !== id) }));
        get().validateSequence();
    },

    updateActionParam: (actionId, paramName, value) => {
        set((state) => {
            const newActions = state.actions.map(a => {
                if (a.id === actionId) {
                    const newParams = a.params.map(p => p.name === paramName ? { ...p, value } : p);
                    return { ...a, params: newParams };
                }
                return a;
            });
            return { actions: newActions };
        });
        get().validateSequence();
    },

    reorderActions: (activeId, overId) => {
        set((state) => {
            const oldIndex = state.actions.findIndex(a => a.id === activeId);
            const newIndex = state.actions.findIndex(a => a.id === overId);
            if (oldIndex === -1 || newIndex === -1) return state;

            const newActions = [...state.actions];
            const [moved] = newActions.splice(oldIndex, 1);
            newActions.splice(newIndex, 0, moved);

            return { actions: newActions };
        });
        get().validateSequence();
    },

    validateSequence: () => {
        const { actions } = get();
        const newErrors: Record<string, string> = {};
        const availableVariables = new Set<string>();

        actions.forEach(action => {
            // Empty field check & sequence validation
            for (const param of action.params) {
                if (!param.value.trim()) {
                    newErrors[action.id] = `Parameter '${param.name}' is missing`;
                    return;
                }
                if (param.type === 'variable' && !availableVariables.has(param.value)) {
                    newErrors[action.id] = `Variable '${param.value}' is used before being defined`;
                    return;
                }
            }

            if (action.outputName) {
                availableVariables.add(action.outputName);
            }
        });

        set({ errors: newErrors });
    }
}));

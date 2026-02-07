import { create } from 'zustand';

type SearchScope = 'GLOBAL' | 'PROJECTS' | 'CLIENTS' | 'MATERIALS' | 'SETTINGS';

interface SearchState {
  isOpen: boolean;
  scope: SearchScope;
  setOpen: (isOpen: boolean) => void;
  setScope: (scope: SearchScope) => void;
  toggle: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  isOpen: false,
  scope: 'GLOBAL',
  setOpen: (isOpen) => set({ isOpen }),
  setScope: (scope) => set({ scope }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

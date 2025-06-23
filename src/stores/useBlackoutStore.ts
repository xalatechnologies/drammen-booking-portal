
import { create } from 'zustand';

interface BlackoutStore {
  blackouts: any[];
  addBlackout: (blackout: any) => void;
  removeBlackout: (id: string) => void;
}

export const useBlackoutStore = create<BlackoutStore>((set) => ({
  blackouts: [],
  addBlackout: (blackout) => set((state) => ({ 
    blackouts: [...state.blackouts, blackout] 
  })),
  removeBlackout: (id) => set((state) => ({ 
    blackouts: state.blackouts.filter(b => b.id !== id) 
  })),
}));

import { create } from 'zustand';
import { Day, DAYS_OF_WEEK } from '@/types/schedule';

export interface TimeSlot {
  id: string; // Use a temporary client-side ID like UUID
  from: string; // e.g., "09:00"
  to: string;   // e.g., "17:00"
}

export interface DaySchedule {
  isOpen: boolean;
  slots: TimeSlot[];
}

export type OpeningHoursState = {
  schedule: Record<Day, DaySchedule>;
  isDirty: boolean; // To track if changes have been made
  actions: {
    initialize: (initialSchedule: Record<Day, DaySchedule>) => void;
    toggleDay: (day: Day, isOpen: boolean) => void;
    addSlot: (day: Day) => void;
    updateSlot: (day: Day, slotId: string, newFrom: string, newTo: string) => void;
    removeSlot: (day: Day, slotId: string) => void;
    copyToAll: (fromDay: Day) => void;
    reset: () => void;
  };
};

const initialDayState = { isOpen: true, slots: [{ id: crypto.randomUUID(), from: '09:00', to: '17:00' }] };
const closedDayState = { isOpen: false, slots: [] };

const initialState = {
  schedule: {
    Monday: initialDayState,
    Tuesday: initialDayState,
    Wednesday: initialDayState,
    Thursday: initialDayState,
    Friday: initialDayState,
    Saturday: closedDayState,
    Sunday: closedDayState,
  },
  isDirty: false,
};

export const useOpeningHoursStore = create<OpeningHoursState>((set) => ({
  ...initialState,
  actions: {
    initialize: (initialSchedule) => set({ schedule: initialSchedule, isDirty: false }),
    toggleDay: (day, isOpen) =>
      set((state) => ({
        schedule: {
          ...state.schedule,
          [day]: { ...state.schedule[day], isOpen },
        },
        isDirty: true,
      })),
    addSlot: (day) =>
      set((state) => {
        const newSlot: TimeSlot = { id: crypto.randomUUID(), from: '09:00', to: '17:00' };
        return {
          schedule: {
            ...state.schedule,
            [day]: { ...state.schedule[day], slots: [...state.schedule[day].slots, newSlot] },
          },
          isDirty: true,
        };
      }),
    updateSlot: (day, slotId, newFrom, newTo) =>
      set((state) => {
        const updatedSlots = state.schedule[day].slots.map((slot) =>
          slot.id === slotId ? { ...slot, from: newFrom, to: newTo } : slot
        );
        return {
          schedule: { ...state.schedule, [day]: { ...state.schedule[day], slots: updatedSlots } },
          isDirty: true,
        };
      }),
    removeSlot: (day, slotId) =>
      set((state) => {
        const filteredSlots = state.schedule[day].slots.filter((slot) => slot.id !== slotId);
        return {
          schedule: { ...state.schedule, [day]: { ...state.schedule[day], slots: filteredSlots } },
          isDirty: true,
        };
      }),
    copyToAll: (fromDay) =>
      set((state) => {
        const slotsToCopy = state.schedule[fromDay].slots;
        const newSchedule = { ...state.schedule };
        DAYS_OF_WEEK.forEach((day) => {
          if (day !== fromDay) {
            newSchedule[day] = {
              ...newSchedule[day],
              slots: slotsToCopy.map(slot => ({ ...slot, id: crypto.randomUUID() })),
            };
          }
        });
        return { schedule: newSchedule, isDirty: true };
      }),
    reset: () => set(initialState),
  }
}));

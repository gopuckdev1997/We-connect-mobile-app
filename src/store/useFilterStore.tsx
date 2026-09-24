import { create } from "zustand";

export interface FilterState {
  selectedCategoryIds: number[];
  pricingType: "ALL" | "HOURLY" | "DAILY";
  maxHourlyRate: number;
  maxDistanceKm: number;
  minRating: number;
  availableOnly: boolean;

  // Actions
  toggleCategory: (id: number) => void;
  setPricingType: (type: "ALL" | "HOURLY" | "DAILY") => void;
  setMaxHourlyRate: (rate: number) => void;
  setMaxDistanceKm: (distance: number) => void;
  setMinRating: (rating: number) => void;
  setAvailableOnly: (available: boolean) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS = {
  selectedCategoryIds: [],
  pricingType: "ALL" as const,
  maxHourlyRate: 1000,
  maxDistanceKm: 15,
  minRating: 0,
  availableOnly: false,
};

export const useFilterStore = create<FilterState>((set) => ({
  ...DEFAULT_FILTERS,

  toggleCategory: (id) =>
    set((state) => ({
      selectedCategoryIds: state.selectedCategoryIds.includes(id)
        ? state.selectedCategoryIds.filter((item) => item !== id)
        : [...state.selectedCategoryIds, id],
    })),

  setPricingType: (pricingType) => set({ pricingType }),
  setMaxHourlyRate: (maxHourlyRate) => set({ maxHourlyRate }),
  setMaxDistanceKm: (maxDistanceKm) => set({ maxDistanceKm }),
  setMinRating: (minRating) => set({ minRating }),
  setAvailableOnly: (availableOnly) => set({ availableOnly }),
  resetFilters: () => set({ ...DEFAULT_FILTERS }),
}));

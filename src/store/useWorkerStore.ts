import { create } from "zustand";

interface WorkerProfileState {
  fullName: string;
  experienceInYear: number;
  bio: string;
  hourlyRate: number;
  setProfileData: (data: Partial<WorkerProfileState>) => void;
  resetProfileState: () => void;
}

export const useWorkerStore = create<WorkerProfileState>((set) => ({
  fullName: "",
  experienceInYear: 0,
  bio: "",
  hourlyRate: 0,
  setProfileData: (data) => set((state) => ({ ...state, ...data })),
  resetProfileState: () =>
    set({ fullName: "", experienceInYear: 0, bio: "", hourlyRate: 0 }),
}));

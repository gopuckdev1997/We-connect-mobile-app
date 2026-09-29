import { create } from "zustand";

interface WorkerProfileState {
  fullName: string;
  age: number;
  gender?: "MALE" | "FEMALE";
  experienceInYear: number;
  bio: string;
  hourlyRate: number;
  address: any;
  profileImage?: string | null;
  setProfileData: (data: Partial<WorkerProfileState>) => void;
  resetProfileState: () => void;
}

export const useWorkerStore = create<WorkerProfileState>((set) => ({
  fullName: "",
  age: 0,
  gender: undefined,
  experienceInYear: 0,
  bio: "",
  hourlyRate: 0,
  address: null,
  profileImage: null,
  setProfileData: (data) => set((state) => ({ ...state, ...data })),
  resetProfileState: () =>
    set({
      fullName: "",
      age: 0,
      gender: undefined,
      experienceInYear: 0,
      bio: "",
      hourlyRate: 0,
      address: null,
      profileImage: null,
    }),
}));

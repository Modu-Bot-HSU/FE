import { create } from "zustand";

interface AuthState {
    tempUser: {
        walletAddress: string;
        email: string;
        name: string;
    } | null;
    setTempUser: (user: AuthState['tempUser']) => void;
}

export const useAuthStore = create<AuthState>((set)=>({
    tempUser: null,
    setTempUser: (user) => set({ tempUser: user }),
}));
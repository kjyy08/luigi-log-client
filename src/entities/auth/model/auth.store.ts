import { create } from 'zustand';
import type { Member } from '@/entities/member';
import type { CredentialsResponse } from './auth.dto';
import type { ProfileResponse } from '@/entities/profile';

interface AuthState {
    member: Member | null;
    credentials: CredentialsResponse | null;
    profile: ProfileResponse | null;
    isAuthenticated: boolean;

    setMember: (member: Member) => void;
    setCredentials: (credentials: CredentialsResponse) => void;
    setProfile: (profile: ProfileResponse) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
    member: null,
    credentials: null,
    profile: null,
    isAuthenticated: false,

    setMember: (member) => set({ member }),

    setCredentials: (credentials) => set({ credentials, isAuthenticated: !!credentials }),

    setProfile: (profile) => set({ profile }),

    logout: () =>
        set({
            member: null,
            credentials: null,
            profile: null,
            isAuthenticated: false,
        }),
}));

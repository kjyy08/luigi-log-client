import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyProfile, updateMyProfile, getRecentComments, getProfile } from '../api/profile.api';


export const profileKeys = {
    all: ['profile'] as const,
    myProfile: (username?: string) => username ? [...profileKeys.all, 'my', username] as const : [...profileKeys.all, 'my'] as const,
    recentComments: () => [...profileKeys.all, 'comments'] as const,
    profile: (username: string) => [...profileKeys.all, username] as const,
};

export const useGetMyProfile = (username?: string, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: profileKeys.myProfile(username),
        queryFn: () => getMyProfile(username!),
        enabled: !!username && (options?.enabled ?? true),
        ...options,
    });
};

export const useGetProfile = (username: string, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: profileKeys.profile(username),
        queryFn: () => getProfile(username),
        enabled: !!username && (options?.enabled ?? true),
        ...options,
    });
};

export const useGetRecentComments = () => {
    return useQuery({
        queryKey: profileKeys.recentComments(),
        queryFn: getRecentComments,
    });
};

export const useUpdateMyProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateMyProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: profileKeys.myProfile() });
        },
    });
};

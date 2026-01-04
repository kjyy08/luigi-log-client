import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyProfile, updateMyProfile } from '../api/profile.api';


export const profileKeys = {
    all: ['profile'] as const,
    myProfile: () => [...profileKeys.all, 'my'] as const,
};

export const useGetMyProfile = (options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: profileKeys.myProfile(),
        queryFn: getMyProfile,
        ...options,
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

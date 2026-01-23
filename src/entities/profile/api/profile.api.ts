import { publicApi } from '@/shared/lib';
import type { CommonResponse } from '@/shared/type/common';
import { profileEndpoints } from '../config/profile-endpoint';
import type { ProfileResponse, UpdateProfileRequest, CommentActivity } from '../model/profile.dto';

export const getRecentComments = async (): Promise<CommentActivity[]> => {
    // Mock implementation for received comments (Guestbook/Post Comments)
    return [
        {
            id: '1',
            content: 'Very informative! Thanks for the solution.',
            postId: 'p1',
            postTitle: 'Understanding React Server Components',
            author: 'frontend_master',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        },
        {
            id: '2',
            content: 'Thanks for the summary. What state management library do you recommend?',
            postId: 'p2',
            postTitle: '2024 State Management Trends',
            author: 'newbie_dev',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        },
        {
            id: '3',
            content: 'I was looking for FSD architecture examples, this helped a lot.',
            postId: 'p3',
            postTitle: 'Scalable Frontend Architecture',
            author: 'arch_lover',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        },
        {
            id: '4',
            content: "I'm confused about the Docker setup, can you explain more?",
            postId: 'p4',
            postTitle: 'DevOps for Frontend Developers',
            author: 'docker_fan',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        }
    ];
};

export const getProfile = async (username: string) => {
    const response = await publicApi.get<CommonResponse<ProfileResponse>>(profileEndpoints.getMyProfile(), {
        params: { username }
    });
    return response.data.data;
};

export const getMyProfile = async (username: string) => {
    const response = await publicApi.get<CommonResponse<ProfileResponse>>(profileEndpoints.getMyProfile(), {
        params: { username }
    });
    // TODO: Remove mocks when backend is ready
    return response.data.data;
};

export const updateMyProfile = async (data: UpdateProfileRequest) => {
    const response = await publicApi.put<CommonResponse<ProfileResponse>>(profileEndpoints.updateMyProfile(), data);
    return response.data.data;
};

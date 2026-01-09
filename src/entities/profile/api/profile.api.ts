import { publicApi } from '@/shared/lib';
import type { CommonResponse } from '@/shared/type/common';
import { profileEndpoints } from '../config/profile-endpoint';
import type { ProfileResponse, UpdateProfileRequest, CommentActivity } from '../model/profile.dto';

export const getRecentComments = async (): Promise<CommentActivity[]> => {
    // Mock implementation for received comments (Guestbook/Post Comments)
    return [
        {
            id: '1',
            content: '정말 유익한 글이네요! 덕분에 해결했습니다.',
            postId: 'p1',
            postTitle: 'React Server Components 이해하기',
            author: 'frontend_master',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        },
        {
            id: '2',
            content: '좋은 정리 감사합니다. 혹시 상태관리 라이브러리는 어떤걸 추천하시나요?',
            postId: 'p2',
            postTitle: '2024년 상태관리 트렌드',
            author: 'newbie_dev',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        },
        {
            id: '3',
            content: 'FSD 아키텍처 적용 사례 찾고 있었는데 도움 많이 되었습니다.',
            postId: 'p3',
            postTitle: '확장 가능한 프론트엔드 아키텍처',
            author: 'arch_lover',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        },
        {
            id: '4',
            content: '도커 설정 부분이 조금 헷갈리는데 추가 설명 가능할까요?',
            postId: 'p4',
            postTitle: '프론트엔드 개발자를 위한 DevOps',
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

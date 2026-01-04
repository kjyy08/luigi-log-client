import { publicApi } from '@/shared/lib';
import type { CommonResponse } from '@/shared/type/common';
import type {
    PostListResponse,
    PostResponse,
    CreatePostRequest,
    UpdatePostRequest,
    PostListRequest
} from '../model/post.dto';

import { postApiEndPoint } from '../config/post-endpoint';

export const getPostList = async (params?: PostListRequest) => {
    const response = await publicApi.get<CommonResponse<PostListResponse>>(
        postApiEndPoint.list(),
        { params }
    );
    return response.data.data;
};

export const getPostDetail = async (id: string) => {
    const response = await publicApi.get<CommonResponse<PostResponse>>(
        postApiEndPoint.detail(id)
    );
    return response.data.data;
};

export const getPostBySlug = async (username: string, slug: string) => {
    const response = await publicApi.get<CommonResponse<PostResponse>>(
        postApiEndPoint.bySlug(username, slug)
    );
    return response.data.data;
}

export const createPost = async (data: CreatePostRequest) => {
    const response = await publicApi.post<CommonResponse<PostResponse>>(
        postApiEndPoint.create(),
        data
    );
    return response.data.data;
};

export const updatePost = async ({ id, data }: { id: string; data: UpdatePostRequest }) => {
    const response = await publicApi.put<CommonResponse<PostResponse>>(
        postApiEndPoint.update(id),
        data
    );
    return response.data.data;
};

export const deletePost = async (id: string) => {
    const response = await publicApi.delete(postApiEndPoint.delete(id));
    return response.data;
};

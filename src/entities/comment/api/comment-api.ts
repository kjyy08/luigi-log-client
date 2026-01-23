import { publicApi } from "@/shared/lib/api-client";
import {
    Comment,
    CommentListResponse,
    CommentResponse,
    CreateCommentRequest,
    UpdateCommentRequest
} from "../model/comment.dto";

export const getComments = async (postId: string): Promise<Comment[]> => {
    const response = await publicApi.get<CommentListResponse>("/api/v1/comments", {
        params: { postId }
    });
    return response.data.data;
};

export const createComment = async (request: CreateCommentRequest): Promise<Comment> => {
    const response = await publicApi.post<CommentResponse>("/api/v1/comments", request);
    return response.data.data;
};

export const updateComment = async (commentId: string, request: UpdateCommentRequest): Promise<Comment> => {
    const response = await publicApi.put<CommentResponse>(`/api/v1/comments/${commentId}`, request);
    return response.data.data;
};

export const deleteComment = async (commentId: string): Promise<void> => {
    await publicApi.delete(`/api/v1/comments/${commentId}`);
};

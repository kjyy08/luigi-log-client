import { CommonResponse } from "@/shared/type/common";

export interface CommentAuthor {
    memberId: string;
    nickname: string;
    profileImageUrl: string | null;
    username: string;
}

export interface Comment {
    commentId: string;
    postId: string;
    author: CommentAuthor;
    content: string;
    createdAt: string;
    updatedAt: string | null;
}

export interface CreateCommentRequest {
    postId: string;
    content: string;
    parentCommentId?: string; // Optional if you want to support replies later
}

export interface UpdateCommentRequest {
    content: string;
}

export type CommentListResponse = CommonResponse<Comment[]>;

export type CommentResponse = CommonResponse<Comment>;

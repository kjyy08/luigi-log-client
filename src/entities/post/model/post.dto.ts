export type PostType = 'BLOG' | 'PORTFOLIO';
export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface PostAuthor {
    memberId: string;
    username: string;
    nickname: string;
    profileImageUrl: string;
}

export interface PostListRequest {
    status?: PostStatus;
    type?: PostType;
    page?: number;
    size?: number;
}

export interface PostResponse {
    postId: string;
    author: PostAuthor;
    title: string;
    slug: string;
    body: string;
    type: PostType;
    status: PostStatus;
    tags: string[];
    viewCount?: number;
    commentCount?: number;
    createdAt: string;
    updatedAt: string;
    thumbnail?: string;
    description?: string;
}

export interface PostListResponse {
    posts: PostResponse[];
    total: number;
}

export interface CreatePostRequest {
    title: string;
    slug: string;
    body: string;
    type: PostType;
    status: PostStatus;
    tags?: string[];
    thumbnail?: string;
    description?: string;
}

export interface UpdatePostRequest {
    title?: string;
    body?: string;
    status?: PostStatus;
    slug?: string;
    tags?: string[];
    thumbnail?: string;
    description?: string;
}

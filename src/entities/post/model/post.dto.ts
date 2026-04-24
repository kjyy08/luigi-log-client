export type PostType = "BLOG" | "PORTFOLIO";
export type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface PostAuthor {
	memberId: string;
	username: string;
	nickname: string;
	profileImageUrl: string;
}

export interface PostListRequest {
	status?: PostStatus;
	type?: PostType;
	q?: string;
	limit?: number;
	cursor?: string;
}

export interface PostResponse {
	postId: string;
	author: PostAuthor;
	title: string;
	slug: string;
	body?: string;
	type: PostType;
	status: PostStatus;
	tags: string[];
	viewCount?: number;
	commentCount?: number;
	createdAt: string;
	updatedAt?: string;
	thumbnail?: string;
	description?: string;
}

export interface PostSummary {
	postId: string;
	author: PostAuthor;
	title: string;
	slug: string;
	type: PostType;
	status: PostStatus;
	tags: string[];
	viewCount: number;
	commentCount: number;
	createdAt: string;
}

export interface PostListResponse {
	posts: PostSummary[];
	total: number;
	pageInfo?: {
		limit: number;
		hasNext: boolean;
		nextCursor?: string | null;
	};
}

export interface PostContributionsRequest {
	from?: string;
	to?: string;
	type?: PostType;
}

export interface PostContributionDay {
	date: string;
	count: number;
}

export interface PostContributionsResponse {
	from: string;
	to: string;
	totalCount: number;
	days: PostContributionDay[];
}

export interface CreatePostRequest {
	title: string;
	slug: string;
	body: string;
	type: PostType;
	tags?: string[];
}

export interface UpdatePostRequest {
	title?: string;
	body?: string;
	status?: PostStatus;
}

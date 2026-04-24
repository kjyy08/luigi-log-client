import { publicApi } from "@/shared/lib";
import type { CommonResponse } from "@/shared/type/common";
import { postApiEndPoint } from "../config/post-endpoint";
import type {
	CreatePostRequest,
	PostContributionsRequest,
	PostContributionsResponse,
	PostListRequest,
	PostListResponse,
	PostResponse,
	UpdatePostRequest,
} from "../model/post.dto";

export const getPostList = async (params?: PostListRequest) => {
	const response = await publicApi.get<CommonResponse<PostListResponse>>(
		postApiEndPoint.list(),
		{ params },
	);
	return response.data.data;
};

export const getPostContributions = async (
	params?: PostContributionsRequest,
) => {
	const response = await publicApi.get<
		CommonResponse<PostContributionsResponse>
	>(postApiEndPoint.contributions(), { params });
	return response.data.data;
};

export const getPostDetail = async (id: string) => {
	const response = await publicApi.get<CommonResponse<PostResponse>>(
		postApiEndPoint.detail(id),
	);
	return response.data.data;
};

export const getPostBySlug = async (username: string, slug: string) => {
	const response = await publicApi.get<CommonResponse<PostResponse>>(
		postApiEndPoint.bySlug(username, slug),
	);
	return response.data.data;
};

export const createPost = async (data: CreatePostRequest) => {
	const response = await publicApi.post<CommonResponse<PostResponse>>(
		postApiEndPoint.create(),
		data,
	);
	return response.data.data;
};

export const updatePost = async ({
	id,
	data,
}: {
	id: string;
	data: UpdatePostRequest;
}) => {
	const response = await publicApi.put<CommonResponse<PostResponse>>(
		postApiEndPoint.update(id),
		data,
	);
	return response.data.data;
};

export const deletePost = async (id: string) => {
	const response = await publicApi.delete(postApiEndPoint.delete(id));
	return response.data;
};

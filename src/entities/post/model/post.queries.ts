import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import {
	getPostBySlug,
	getPostContributions,
	getPostDetail,
	getPostList,
} from "../api/post.api";
import type { PostContributionsRequest, PostListRequest } from "./post.dto";

export const postQueries = {
	all: () => ["posts"] as const,
	lists: () => [...postQueries.all(), "list"] as const,
	list: (params?: PostListRequest) =>
		queryOptions({
			queryKey: [...postQueries.lists(), params],
			queryFn: () => getPostList(params),
			placeholderData: keepPreviousData,
		}),
	contributions: (params?: PostContributionsRequest) =>
		queryOptions({
			queryKey: [...postQueries.all(), "contributions", params] as const,
			queryFn: () => getPostContributions(params),
			placeholderData: keepPreviousData,
		}),
	details: () => [...postQueries.all(), "detail"] as const,
	detail: (id: string) =>
		queryOptions({
			queryKey: [...postQueries.details(), id] as const,
			queryFn: () => getPostDetail(id),
		}),
	detailBySlug: (username: string, slug: string) =>
		queryOptions({
			queryKey: [...postQueries.details(), username, slug] as const,
			queryFn: () => getPostBySlug(username, slug),
		}),
};

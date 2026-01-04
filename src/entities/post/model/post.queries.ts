import { queryOptions, keepPreviousData } from "@tanstack/react-query";
import { getPostList, getPostDetail, getPostBySlug } from "../api/post.api";
import type { PostListRequest } from "./post.dto";

export const postQueries = {
    all: () => ["posts"] as const,
    lists: () => [...postQueries.all(), "list"] as const,
    list: (params?: PostListRequest) =>
        queryOptions({
            queryKey: [...postQueries.lists(), params],
            queryFn: () => getPostList(params),
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
        })
};

import { queryOptions } from "@tanstack/react-query";
import { getComments } from "../api/comment-api";

export const commentQueries = {
    all: () => ["comment"] as const,
    lists: () => [...commentQueries.all(), "list"] as const,
    list: (postId: string) =>
        queryOptions({
            queryKey: [...commentQueries.lists(), postId],
            queryFn: () => getComments(postId),
        }),
};

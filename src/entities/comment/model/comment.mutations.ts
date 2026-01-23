import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment, deleteComment, updateComment } from "../api/comment-api";
import { commentQueries } from "./comment.queries";

export const useCreateComment = (postId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createComment,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: commentQueries.list(postId).queryKey,
            });
        },
    });
};

export const useUpdateComment = (postId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
            updateComment(commentId, { content }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: commentQueries.list(postId).queryKey,
            });
        },
    });
};

export const useDeleteComment = (postId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteComment,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: commentQueries.list(postId).queryKey,
            });
        },
    });
};

import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGuestbookList, createGuestbook, updateGuestbook, deleteGuestbook } from "../api/guestbook.api";
import type { CreateGuestbookRequest, UpdateGuestbookRequest } from "./guestbook.dto";

export const guestbookQueries = {
    all: () => ["guestbooks"] as const,
    lists: () => [...guestbookQueries.all(), "list"] as const,
    list: () =>
        queryOptions({
            queryKey: guestbookQueries.lists(),
            queryFn: () => getGuestbookList(),
        }),
};

export const useCreateGuestbook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateGuestbookRequest) => createGuestbook(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: guestbookQueries.lists() });
        },
    });
};

export const useUpdateGuestbook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateGuestbookRequest }) =>
            updateGuestbook(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: guestbookQueries.lists() });
        },
    });
};

export const useDeleteGuestbook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteGuestbook(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: guestbookQueries.lists() });
        },
    });
};

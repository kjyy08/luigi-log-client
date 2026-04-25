import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createApiKey, revokeApiKey } from "../api/api-key.api";
import { apiKeyQueries } from "./api-key.queries";

export const useCreateApiKey = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createApiKey,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: apiKeyQueries.lists() });
		},
	});
};

export const useRevokeApiKey = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: revokeApiKey,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: apiKeyQueries.lists() });
		},
	});
};

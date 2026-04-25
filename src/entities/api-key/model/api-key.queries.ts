import { queryOptions } from "@tanstack/react-query";
import { getApiKeys } from "../api/api-key.api";

export const apiKeyQueries = {
	all: () => ["api-keys"] as const,
	lists: () => [...apiKeyQueries.all(), "list"] as const,
	list: () =>
		queryOptions({
			queryKey: apiKeyQueries.lists(),
			queryFn: getApiKeys,
		}),
};

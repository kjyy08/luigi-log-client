export const API_KEY_API_BASE = "/api/v1/keys";

export const apiKeyEndPoint = {
	list: () => API_KEY_API_BASE,
	create: () => API_KEY_API_BASE,
	revoke: (apiKeyId: string) => `${API_KEY_API_BASE}/${apiKeyId}`,
};

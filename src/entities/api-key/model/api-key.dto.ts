export const API_KEY_SCOPES = [
	"post:create",
	"post:update",
	"post:publish",
	"media:upload",
] as const;

export type ApiKeyScope = (typeof API_KEY_SCOPES)[number];

export type ApiKeyStatus = "ACTIVE" | "REVOKED" | "EXPIRED" | string;

export interface ApiKey {
	id: string;
	name: string;
	prefix: string;
	scopes: ApiKeyScope[];
	status: ApiKeyStatus;
	expiresAt: string | null;
	lastUsedAt: string | null;
	createdAt: string;
}

export interface ApiKeyListResponse {
	apiKeys: ApiKey[];
}

export interface CreateApiKeyRequest {
	name: string;
	scopes: ApiKeyScope[];
	expiresAt?: string | null;
}

export interface CreateApiKeyResponse extends ApiKey {
	secretKey: string;
}

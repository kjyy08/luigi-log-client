import { publicApi } from "@/shared/lib";
import type { CommonResponse } from "@/shared/type/common";
import { apiKeyEndPoint } from "../config/api-key-endpoint";
import type {
	ApiKeyListResponse,
	CreateApiKeyRequest,
	CreateApiKeyResponse,
} from "../model/api-key.dto";

export const getApiKeys = async () => {
	const response = await publicApi.get<CommonResponse<ApiKeyListResponse>>(
		apiKeyEndPoint.list(),
	);
	return response.data.data;
};

export const createApiKey = async (data: CreateApiKeyRequest) => {
	const response = await publicApi.post<CommonResponse<CreateApiKeyResponse>>(
		apiKeyEndPoint.create(),
		data,
	);
	return response.data.data;
};

export const revokeApiKey = async (apiKeyId: string) => {
	const response = await publicApi.delete(apiKeyEndPoint.revoke(apiKeyId));
	return response.data;
};

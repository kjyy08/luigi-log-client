import { publicApi } from '@/shared/lib';
import type { CommonResponse } from '@/shared/type/common';
import { authApiEndPoint } from '../config/auth-endpoint';
import type { CredentialsResponse } from '../model/auth.dto';

export const reissueToken = async () => {
    // Cookie-based reissue (backend handles token extraction from cookies)
    await publicApi.post(authApiEndPoint.reissue());
    // No response parsing needed if backend sets cookies automatically
};

export const logout = async () => {
    return publicApi.post(authApiEndPoint.logout());
};

export const getMyCredentials = async () => {
    const response = await publicApi.get<CommonResponse<CredentialsResponse>>(
        authApiEndPoint.me()
    );
    return response.data;
};


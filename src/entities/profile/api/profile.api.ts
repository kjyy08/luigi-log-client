import { publicApi } from '@/shared/lib';
import type { CommonResponse } from '@/shared/type/common';
import { profileEndpoints } from '../config/profile-endpoint';
import type { ProfileResponse, UpdateProfileRequest } from '../model/profile.dto';

export const getMyProfile = async () => {
    const response = await publicApi.get<CommonResponse<ProfileResponse>>(profileEndpoints.getMyProfile());
    return response.data.data;
};

export const updateMyProfile = async (data: UpdateProfileRequest) => {
    const response = await publicApi.put<CommonResponse<ProfileResponse>>(profileEndpoints.updateMyProfile(), data);
    return response.data.data;
};

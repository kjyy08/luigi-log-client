import { publicApi } from '@/shared/lib';
import type { CommonResponse } from '@/shared/type/common';
import { memberApiEndPoint } from '../config/member-endpoint';
import type { MemberResponse } from '@/shared/type/member';

export const getMember = async (memberId: string) => {
    const response = await publicApi.get<CommonResponse<MemberResponse>>(memberApiEndPoint.getMember(memberId));
    return response.data.data;
};

export const getMyMemberInfo = async () => {
    const response = await publicApi.get<CommonResponse<MemberResponse>>(memberApiEndPoint.me());
    return response.data.data;
};

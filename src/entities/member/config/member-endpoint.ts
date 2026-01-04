export const MEMBER_BASE = '/api/v1/members';

export const memberApiEndPoint = {
    getMember: (memberId: string) => `${MEMBER_BASE}/${memberId}`,
    me: () => `${MEMBER_BASE}/me`,
};

export interface Member {
    memberId: string;
    email: string;
    username: string;
}

export interface MemberResponse {
    memberId: string;
    email: string;
    username: string;
}

export interface MemberProfile {
    memberId: string;
    nickname: string;
    profileImageUrl: string | null;
    username: string;
}

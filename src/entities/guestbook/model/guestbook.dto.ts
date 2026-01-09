import type { MemberProfile } from "@/entities/member/model/member.dto";

export interface GuestbookEntry {
    guestbookId: string;
    content: string;
    author: MemberProfile;
    createdAt: string;
    updatedAt: string;
}

export interface CreateGuestbookRequest {
    content: string;
}

export interface UpdateGuestbookRequest {
    content: string;
}

export interface GuestbookListResponse {
    guestbooks: GuestbookEntry[];
    totalCount: number;
}


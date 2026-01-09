import { publicApi } from '@/shared/lib';
import type { CommonResponse } from '@/shared/type/common';
import { guestbookApiEndPoint } from '../config/guestbook-endpoint';
import type {
    GuestbookListResponse,
    CreateGuestbookRequest,
    UpdateGuestbookRequest,
    GuestbookEntry
} from '../model/guestbook.dto';

export const getGuestbookList = async () => {
    const response = await publicApi.get<CommonResponse<GuestbookEntry[]>>(
        guestbookApiEndPoint.list()
    );
    return response.data.data;
};

export const createGuestbook = async (data: CreateGuestbookRequest) => {
    const response = await publicApi.post<CommonResponse<void>>(
        guestbookApiEndPoint.create(),
        data
    );
    return response.data.data;
};

export const updateGuestbook = async (id: string, data: UpdateGuestbookRequest) => {
    const response = await publicApi.put<CommonResponse<void>>(
        guestbookApiEndPoint.update(id),
        data
    );
    return response.data.data;
};

export const deleteGuestbook = async (id: string) => {
    const response = await publicApi.delete<CommonResponse<void>>(
        guestbookApiEndPoint.delete(id)
    );
    return response.data.data;
};

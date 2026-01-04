import { publicApi } from '@/shared/lib';
import type { CommonResponse } from '@/shared/type/common';
import type { FileResponse } from '../model/file.dto';
import { fileApiEndPoint } from '../config/file-endpoint';

export const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await publicApi.post<CommonResponse<FileResponse>>(
        fileApiEndPoint.upload(),
        formData
    );
    return response.data.data;
};

export const deleteFile = async (id: string) => {
    const response = await publicApi.delete(fileApiEndPoint.delete(id));
    return response.data;
};

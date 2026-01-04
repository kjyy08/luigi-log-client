import { useMutation } from '@tanstack/react-query';
import { uploadFile, deleteFile } from '../api/file.api';

export const useUploadFile = () => {
    return useMutation({
        mutationFn: uploadFile,
    });
};

export const useDeleteFile = () => {
    return useMutation({
        mutationFn: deleteFile,
    });
};

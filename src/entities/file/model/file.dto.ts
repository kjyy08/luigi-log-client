export interface FileResponse {
    fileId: string;
    originalFileName: string;
    mimeType: string;
    fileSize: number;
    publicUrl: string;
}

export interface FileListResponse {
    files: FileResponse[];
    total: number;
}

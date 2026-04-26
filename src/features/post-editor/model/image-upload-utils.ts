export type ImageUploadStatus = "pending" | "uploading" | "success" | "failed";

export interface ImageUploadItem {
    id: string;
    fileName: string;
    file: File;
    placeholder: string;
    status: ImageUploadStatus;
    error?: string;
    publicUrl?: string;
}

export interface ImageFileValidationResult {
    validFiles: File[];
    rejectedFiles: Array<{ file: File; reason: string }>;
}

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
export const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024;
export const UPLOAD_PLACEHOLDER_PROTOCOL = "luigi-upload://";

export const createImageUploadPlaceholder = (fileName: string, uploadId: string) =>
    `![Uploading ${fileName}…](${UPLOAD_PLACEHOLDER_PROTOCOL}${uploadId})`;

export const insertTextAtSelection = (
    value: string,
    text: string,
    selectionStart: number,
    selectionEnd: number,
) => `${value.slice(0, selectionStart)}${text}${value.slice(selectionEnd)}`;

export const replaceImageUploadPlaceholder = (
    value: string,
    uploadId: string,
    fileName: string,
    publicUrl: string,
) => value.replace(
    createImageUploadPlaceholder(fileName, uploadId),
    `![${fileName}](${publicUrl})`,
);

export const removeImageUploadPlaceholder = (value: string, placeholder: string) =>
    value
        .replace(`\n${placeholder}\n`, "\n")
        .replace(placeholder, "")
        .replace(/\n{3,}/g, "\n\n");

export const hasUnresolvedImageUploadPlaceholders = (value: string) =>
    value.includes(UPLOAD_PLACEHOLDER_PROTOCOL);

export const getImageUploadPublishBlockMessage = (
    uploads: Array<Pick<ImageUploadItem, "status">>,
    body: string,
) => {
    if (uploads.some((upload) => upload.status === "failed")) {
        return "Some images failed to upload. Retry or remove them before publishing.";
    }

    if (
        uploads.some((upload) => upload.status === "pending" || upload.status === "uploading") ||
        hasUnresolvedImageUploadPlaceholders(body)
    ) {
        return "Images are still uploading.";
    }

    return null;
};

export const validateImageFiles = (files: File[]): ImageFileValidationResult => {
    const validFiles: File[] = [];
    const rejectedFiles: Array<{ file: File; reason: string }> = [];

    for (const file of files) {
        if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
            rejectedFiles.push({ file, reason: "Only JPEG, PNG, WebP, and GIF images are supported." });
            continue;
        }

        if (file.size > MAX_IMAGE_FILE_SIZE) {
            rejectedFiles.push({ file, reason: "Images must be 5MB or smaller." });
            continue;
        }

        validFiles.push(file);
    }

    return { validFiles, rejectedFiles };
};

export const getImageFilesFromDataTransfer = (dataTransfer: DataTransfer) => {
    const files = Array.from(dataTransfer.files);
    return files.filter((file) => file.type.startsWith("image/"));
};

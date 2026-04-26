import { useCallback } from "react";
import { uploadFile } from "@/entities/file/api/file.api";
import { useToast } from "@/shared/hooks/use-toast";
import { useEditorStore } from "./editor.store";
import {
    createImageUploadPlaceholder,
    getImageFilesFromDataTransfer,
    insertTextAtSelection,
    removeImageUploadPlaceholder,
    replaceImageUploadPlaceholder,
    validateImageFiles,
    type ImageUploadItem,
} from "./image-upload-utils";

const createUploadId = () => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

interface UseImageUploadEditorOptions {
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export const useImageUploadEditor = ({ textareaRef }: UseImageUploadEditorOptions) => {
    const { toast } = useToast();
    const {
        body,
        setBody,
        imageUploads,
        addImageUploads,
        updateImageUpload,
        removeImageUpload,
    } = useEditorStore();

    const startUpload = useCallback(
        async (upload: ImageUploadItem) => {
            updateImageUpload(upload.id, { status: "uploading", error: undefined });

            try {
                const response = await uploadFile(upload.file);
                const state = useEditorStore.getState();
                const replacementName = response.originalFileName || upload.fileName;

                state.setBody(
                    replaceImageUploadPlaceholder(
                        state.body,
                        upload.id,
                        upload.fileName,
                        response.publicUrl,
                    ),
                );
                state.updateImageUpload(upload.id, {
                    status: "success",
                    error: undefined,
                    fileName: replacementName,
                    publicUrl: response.publicUrl,
                });
            } catch (error) {
                console.error("Image upload failed", error);
                useEditorStore.getState().updateImageUpload(upload.id, {
                    status: "failed",
                    error: "Upload failed.",
                });
            }
        },
        [updateImageUpload],
    );

    const insertAndUploadImages = useCallback(
        (files: File[], selectionStart?: number, selectionEnd?: number) => {
            const { validFiles, rejectedFiles } = validateImageFiles(files);

            if (rejectedFiles.length > 0) {
                toast({
                    title: "Some images were not added",
                    description: rejectedFiles.map(({ file, reason }) => `${file.name}: ${reason}`).join("\n"),
                    variant: "destructive",
                });
            }

            if (validFiles.length === 0) return;

            const currentBody = useEditorStore.getState().body;
            const textarea = textareaRef.current;
            const start = selectionStart ?? textarea?.selectionStart ?? currentBody.length;
            const end = selectionEnd ?? textarea?.selectionEnd ?? start;

            const uploads = validFiles.map((file) => {
                const id = createUploadId();
                const placeholder = createImageUploadPlaceholder(file.name, id);

                return {
                    id,
                    file,
                    fileName: file.name,
                    placeholder,
                    status: "pending" as const,
                };
            });

            const insertion = `${uploads.map((upload) => upload.placeholder).join("\n")}\n`;
            setBody(insertTextAtSelection(currentBody, insertion, start, end));
            addImageUploads(uploads);

            for (const upload of uploads) {
                void startUpload(upload);
            }

            requestAnimationFrame(() => {
                const nextCursor = start + insertion.length;
                textareaRef.current?.focus();
                textareaRef.current?.setSelectionRange(nextCursor, nextCursor);
            });
        },
        [addImageUploads, setBody, startUpload, textareaRef, toast],
    );

    const handlePaste = useCallback(
        (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
            const files = Array.from(event.clipboardData.files).filter((file) => file.type.startsWith("image/"));

            if (files.length === 0) return;

            event.preventDefault();
            insertAndUploadImages(files, event.currentTarget.selectionStart, event.currentTarget.selectionEnd);
        },
        [insertAndUploadImages],
    );

    const handleDrop = useCallback(
        (event: React.DragEvent<HTMLTextAreaElement>) => {
            const files = getImageFilesFromDataTransfer(event.dataTransfer);

            if (files.length === 0) return;

            event.preventDefault();
            insertAndUploadImages(files, event.currentTarget.selectionStart, event.currentTarget.selectionEnd);
        },
        [insertAndUploadImages],
    );

    const handleDragOver = useCallback((event: React.DragEvent<HTMLTextAreaElement>) => {
        if (Array.from(event.dataTransfer.items).some((item) => item.kind === "file")) {
            event.preventDefault();
        }
    }, []);

    const retryImageUpload = useCallback(
        (uploadId: string) => {
            const upload = useEditorStore.getState().imageUploads.find((item) => item.id === uploadId);
            if (!upload) return;

            void startUpload(upload);
        },
        [startUpload],
    );

    const removeImageUploadPlaceholderById = useCallback(
        (uploadId: string) => {
            const upload = useEditorStore.getState().imageUploads.find((item) => item.id === uploadId);
            if (!upload) return;

            const state = useEditorStore.getState();
            state.setBody(removeImageUploadPlaceholder(state.body, upload.placeholder));
            removeImageUpload(uploadId);
        },
        [removeImageUpload],
    );

    return {
        body,
        imageUploads,
        insertAndUploadImages,
        handlePaste,
        handleDrop,
        handleDragOver,
        retryImageUpload,
        removeImageUploadPlaceholderById,
    };
};

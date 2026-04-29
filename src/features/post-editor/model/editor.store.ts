import { create } from "zustand";
import type { PostType } from "@/entities/post/model/post.dto";
import type { ImageUploadItem, ImageUploadStatus } from "./image-upload-utils";

interface EditorState {
    title: string;
    body: string;
    slug: string;
    tags: string[];
    type: PostType;
    description?: string;
    postId?: string | null;
    imageUploads: ImageUploadItem[];

    // Actions
    setTitle: (title: string) => void;
    setBody: (body: string) => void;
    setSlug: (slug: string) => void;
    setTags: (tags: string[]) => void;
    setType: (type: PostType) => void;
    setDescription: (description: string) => void;
    setPostId: (postId: string | null) => void;
    addImageUploads: (uploads: ImageUploadItem[]) => void;
    updateImageUpload: (id: string, patch: Partial<Omit<ImageUploadItem, "id">>) => void;
    removeImageUpload: (id: string) => void;
    setImageUploadStatus: (id: string, status: ImageUploadStatus, error?: string) => void;
    reset: () => void;
}

export const useEditorStore = create<EditorState>()((set) => ({
    title: "",
    body: "",
    slug: "",
    tags: [],
    type: "BLOG",
    description: "",
    postId: null,
    imageUploads: [],

    setTitle: (title) => set({ title }),
    setBody: (body) => set({ body }),
    setSlug: (slug) => set({ slug }),
    setTags: (tags) => set({ tags }),
    setType: (type) => set({ type }),
    setDescription: (description) => set({ description }),
    setPostId: (postId) => set({ postId }),
    addImageUploads: (uploads) =>
        set((state) => ({ imageUploads: [...state.imageUploads, ...uploads] })),
    updateImageUpload: (id, patch) =>
        set((state) => ({
            imageUploads: state.imageUploads.map((upload) =>
                upload.id === id ? { ...upload, ...patch } : upload,
            ),
        })),
    removeImageUpload: (id) =>
        set((state) => ({
            imageUploads: state.imageUploads.filter((upload) => upload.id !== id),
        })),
    setImageUploadStatus: (id, status, error) =>
        set((state) => ({
            imageUploads: state.imageUploads.map((upload) =>
                upload.id === id ? { ...upload, status, error } : upload,
            ),
        })),
    reset: () =>
        set({
            title: "",
            body: "",
            slug: "",
            tags: [],
            type: "BLOG",
            description: "",
            postId: null,
            imageUploads: [],
        }),
}));

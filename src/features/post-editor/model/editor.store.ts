import { create } from "zustand";
import type { PostType } from "@/entities/post/model/post.dto";

interface EditorState {
    title: string;
    body: string;
    slug: string;
    tags: string[];
    type: PostType;
    thumbnail?: string | null;
    description?: string;
    postId?: string | null;

    // Actions
    setTitle: (title: string) => void;
    setBody: (body: string) => void;
    setSlug: (slug: string) => void;
    setTags: (tags: string[]) => void;
    setType: (type: PostType) => void;
    setThumbnail: (thumbnail: string | null) => void;
    setDescription: (description: string) => void;
    setPostId: (postId: string | null) => void;
    reset: () => void;
}

export const useEditorStore = create<EditorState>()((set) => ({
    title: "",
    body: "",
    slug: "",
    tags: [],
    type: "BLOG",
    thumbnail: null,
    description: "",
    postId: null,

    setTitle: (title) => set({ title }),
    setBody: (body) => set({ body }),
    setSlug: (slug) => set({ slug }),
    setTags: (tags) => set({ tags }),
    setType: (type) => set({ type }),
    setThumbnail: (thumbnail) => set({ thumbnail }),
    setDescription: (description) => set({ description }),
    setPostId: (postId) => set({ postId }),
    reset: () =>
        set({
            title: "",
            body: "",
            slug: "",
            tags: [],
            type: "BLOG",
            thumbnail: null,
            description: "",
            postId: null,
        }),
}));

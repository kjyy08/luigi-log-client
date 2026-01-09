import { useAuthStore } from "@/entities/auth/model/auth.store";
import { BLOG_OWNER_USERNAME } from "@/shared/config";

export const useIsOwner = () => {
    const { member, isAuthenticated } = useAuthStore();

    // Check if the user is logged in AND their username matches the blog owner
    const isOwner = isAuthenticated && member?.username === BLOG_OWNER_USERNAME;

    return isOwner;
};

import type { AdjacentPost } from "@/entities/post/model/post.dto";

interface PostAdjacentNavigationSource {
	author?: { username?: string | null } | null;
	previousPost?: AdjacentPost | null;
	nextPost?: AdjacentPost | null;
}

export const getPostAdjacentNavigationProps = (
	post: PostAdjacentNavigationSource,
	username?: string,
) => ({
	previousPost: post.previousPost,
	nextPost: post.nextPost,
	currentUsername: post.author?.username ?? username ?? "",
});

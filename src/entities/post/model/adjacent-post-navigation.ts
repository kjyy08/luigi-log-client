import type { AdjacentPost } from "./post.dto";

export const hasAdjacentPosts = (
	previousPost?: AdjacentPost | null,
	nextPost?: AdjacentPost | null,
) => Boolean(previousPost || nextPost);

export const buildAdjacentPostPath = (post: AdjacentPost, currentUsername: string) => {
	return `/posts/${currentUsername}/${post.slug}`;
};

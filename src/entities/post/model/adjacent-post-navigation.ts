import type { AdjacentPost } from "./post.dto";

export const hasAdjacentPosts = (
	previousPost?: AdjacentPost | null,
	nextPost?: AdjacentPost | null,
) => Boolean(previousPost || nextPost);

export const getAdjacentPostSlotClassName = (direction: "previous" | "next") => {
	return direction === "next" ? "sm:col-start-2" : undefined;
};

export const buildAdjacentPostPath = (post: AdjacentPost, currentUsername: string) => {
	return `/posts/${currentUsername}/${post.slug}`;
};

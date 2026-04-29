import type { AdjacentPost } from "./post.dto";

export type AdjacentPostDirection = "previous" | "next";

export const hasAdjacentPosts = (
	previousPost?: AdjacentPost | null,
	nextPost?: AdjacentPost | null,
) => Boolean(previousPost || nextPost);

export const buildAdjacentPostPath = (post: AdjacentPost, currentUsername: string) => {
	return `/posts/${currentUsername}/${post.slug}`;
};

export const buildAdjacentPostAriaLabel = (
	post: AdjacentPost,
	direction: AdjacentPostDirection,
) =>
	direction === "previous"
		? `Go to previous post: ${post.title}`
		: `Go to next post: ${post.title}`;

export const getAdjacentPostPlacementClassName = (
	direction: AdjacentPostDirection,
	hasPreviousPost: boolean,
	hasNextPost: boolean,
) => {
	if (direction === "previous") return "sm:justify-self-start";

	return hasPreviousPost && hasNextPost
		? "sm:justify-self-end sm:text-right"
		: "sm:col-start-2 sm:justify-self-end sm:text-right";
};

export const shouldScrollRouteToTop = (
	fromPathname: string,
	toPathname: string,
	toHash: string,
) => !toHash && fromPathname !== toPathname;

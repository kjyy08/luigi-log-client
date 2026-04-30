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

export const getAdjacentPostInnerColumnClassName = () =>
	"md:ml-14 md:w-[calc(100%-3.5rem)]";

export const getAdjacentPostGridClassName = () =>
	"grid w-full min-w-0 max-w-full grid-cols-1 gap-3 xl:grid-cols-2";

export const getAdjacentPostPlacementClassName = (
	direction: AdjacentPostDirection,
	hasPreviousPost: boolean,
	hasNextPost: boolean,
) => {
	if (direction === "previous") return "xl:justify-self-start";

	return hasPreviousPost && hasNextPost
		? "xl:justify-self-end xl:text-right"
		: "xl:col-start-2 xl:justify-self-end xl:text-right";
};

export const shouldScrollRouteToTop = (
	fromPathname: string,
	toPathname: string,
	toHash: string,
) => !toHash && fromPathname !== toPathname;

import test from "node:test";
import assert from "node:assert/strict";

import {
    buildAdjacentPostAriaLabel,
    buildAdjacentPostPath,
    getAdjacentPostPlacementClassName,
    hasAdjacentPosts,
    shouldScrollRouteToTop,
} from "./adjacent-post-navigation.ts";

test("builds adjacent post paths with the current author's username fallback", () => {
    assert.equal(
        buildAdjacentPostPath({ postId: "post-1", title: "Prev", slug: "previous-post", createdAt: "2026-04-28T00:00:00Z" }, "luigi"),
        "/posts/luigi/previous-post",
    );
});

test("detects whether any adjacent post should render", () => {
    assert.equal(hasAdjacentPosts(null, undefined), false);
    assert.equal(
        hasAdjacentPosts(null, { postId: "post-2", title: "Next", slug: "next-post", createdAt: "2026-04-30T00:00:00Z" }),
        true,
    );
});

test("builds direction-specific aria labels for full-card adjacent links", () => {
    const post = { postId: "post-1", title: "A very long adjacent post title", slug: "adjacent-post", createdAt: "2026-04-28T00:00:00Z" };

    assert.equal(buildAdjacentPostAriaLabel(post, "previous"), "Go to previous post: A very long adjacent post title");
    assert.equal(buildAdjacentPostAriaLabel(post, "next"), "Go to next post: A very long adjacent post title");
});

test("places a single next post at the desktop end without rendering a placeholder", () => {
    assert.equal(getAdjacentPostPlacementClassName("previous", true, true), "sm:justify-self-start");
    assert.equal(getAdjacentPostPlacementClassName("next", true, true), "sm:justify-self-end sm:text-right");
    assert.equal(getAdjacentPostPlacementClassName("previous", true, false), "sm:justify-self-start");
    assert.equal(getAdjacentPostPlacementClassName("next", false, true), "sm:col-start-2 sm:justify-self-end sm:text-right");
});

test("scrolls pathname route changes to top only when the target has no hash", () => {
    assert.equal(shouldScrollRouteToTop("/posts/luigi/old-post", "/posts/luigi/new-post", ""), true);
    assert.equal(shouldScrollRouteToTop("/blog", "/portfolio", ""), true);
    assert.equal(shouldScrollRouteToTop("/blog", "/posts/luigi/new-post", ""), true);
    assert.equal(shouldScrollRouteToTop("/posts/luigi/old-post", "/posts/luigi/new-post", "#heading"), false);
    assert.equal(shouldScrollRouteToTop("/blog", "/blog", ""), false);
});

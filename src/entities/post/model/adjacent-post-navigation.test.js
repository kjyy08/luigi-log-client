import test from "node:test";
import assert from "node:assert/strict";

import { buildAdjacentPostPath, hasAdjacentPosts } from "./adjacent-post-navigation.ts";

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

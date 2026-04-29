import test from "node:test";
import assert from "node:assert/strict";

import { getPostAdjacentNavigationProps } from "./post-adjacent-navigation-props.ts";

const adjacentPost = {
    postId: "post-2",
    title: "Next",
    slug: "next-post",
    createdAt: "2026-04-30T00:00:00Z",
};

test("maps post detail response adjacent fields to navigation props", () => {
    assert.deepEqual(
        getPostAdjacentNavigationProps(
            {
                author: { username: "author-name" },
                previousPost: null,
                nextPost: adjacentPost,
            },
            "route-name",
        ),
        {
            previousPost: null,
            nextPost: adjacentPost,
            currentUsername: "author-name",
        },
    );
});

test("falls back to the route username when author username is unavailable", () => {
    assert.equal(
        getPostAdjacentNavigationProps(
            {
                author: undefined,
                previousPost: adjacentPost,
                nextPost: null,
            },
            "route-name",
        ).currentUsername,
        "route-name",
    );
});

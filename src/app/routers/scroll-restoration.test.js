import test from "node:test";
import assert from "node:assert/strict";

import { shouldScrollToTopOnLocationChange } from "./scroll-restoration.ts";

test("scrolls to top for a new post detail path without a hash", () => {
    assert.equal(
        shouldScrollToTopOnLocationChange(
            { pathname: "/posts/luigi/old-post", hash: "" },
            { pathname: "/posts/luigi/new-post", hash: "" },
        ),
        true,
    );
});

test("does not override hash anchor navigation", () => {
    assert.equal(
        shouldScrollToTopOnLocationChange(
            { pathname: "/posts/luigi/old-post", hash: "" },
            { pathname: "/posts/luigi/new-post", hash: "#section" },
        ),
        false,
    );
});

test("does not scroll when only the hash changes", () => {
    assert.equal(
        shouldScrollToTopOnLocationChange(
            { pathname: "/posts/luigi/new-post", hash: "#intro" },
            { pathname: "/posts/luigi/new-post", hash: "#details" },
        ),
        false,
    );
});

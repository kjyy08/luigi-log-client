import test from "node:test";
import assert from "node:assert/strict";

import { buildPostDetailMetadata } from "./post-detail-seo-metadata.ts";

test("builds article SEO metadata from post detail route params and post details", () => {
    const metadata = buildPostDetailMetadata({
        username: "kjyy08",
        slug: "seo-og",
        post: {
            title: "SEO + OG MVP",
            description: "A concise custom summary.",
            body: "# Ignored when description exists",
            tags: ["seo", "react"],
            createdAt: "2026-05-28T00:00:00.000Z",
            updatedAt: "2026-05-28T01:00:00.000Z",
        },
    });

    assert.equal(metadata.title, "SEO + OG MVP | Luigi Log");
    assert.equal(metadata.description, "A concise custom summary.");
    assert.equal(metadata.url, "https://blog.luigi99.cloud/posts/kjyy08/seo-og");
    assert.equal(metadata.type, "article");
    assert.deepEqual(metadata.tags, ["seo", "react"]);
    assert.equal(metadata.publishedTime, "2026-05-28T00:00:00.000Z");
    assert.equal(metadata.modifiedTime, "2026-05-28T01:00:00.000Z");
});

test("falls back to a plain-text description from the post body", () => {
    const metadata = buildPostDetailMetadata({
        username: "kjyy08",
        slug: "markdown-body",
        post: {
            title: "Markdown Body",
            body: "# Intro\n\nThis is **readable** markdown.",
        },
    });

    assert.equal(metadata.description, "Intro This is readable markdown.");
});

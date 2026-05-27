import test from "node:test";
import assert from "node:assert/strict";

import {
    buildCanonicalUrl,
    buildDefaultMetadata,
    buildPostMetadata,
    extractPlainTextDescription,
} from "./metadata.ts";

test("builds canonical URLs against the production blog origin", () => {
    assert.equal(buildCanonicalUrl("/blog"), "https://blog.luigi99.cloud/blog");
    assert.equal(buildCanonicalUrl("posts/kjyy08/hello world"), "https://blog.luigi99.cloud/posts/kjyy08/hello%20world");
});

test("builds default SEO metadata with favicon fallback image and Twitter card", () => {
    const metadata = buildDefaultMetadata({ path: "/portfolio", title: "Portfolio | Luigi Log" });

    assert.equal(metadata.title, "Portfolio | Luigi Log");
    assert.equal(metadata.description, "Luigi Log — development notes, blog posts, and portfolio work by Luigi.");
    assert.equal(metadata.url, "https://blog.luigi99.cloud/portfolio");
    assert.equal(metadata.image, "https://blog.luigi99.cloud/web-app-manifest-512x512.png");
    assert.equal(metadata.twitterCard, "summary_large_image");
    assert.equal(metadata.type, "website");
});

test("builds post SEO metadata from post details", () => {
    const metadata = buildPostMetadata({
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

test("extracts readable post descriptions from markdown body", () => {
    const description = extractPlainTextDescription("# Title\n\n![alt](image.png)\nThis is **bold** copy with `code` and [a link](https://example.com).", 60);

    assert.equal(description, "Title This is bold copy with code and a link.");
});

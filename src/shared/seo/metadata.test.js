import test from "node:test";
import assert from "node:assert/strict";

import {
    buildCanonicalUrl,
    buildDefaultMetadata,
    extractPlainTextDescription,
} from "./metadata.ts";

test("builds canonical URLs against the production blog origin", () => {
    assert.equal(buildCanonicalUrl("/docs"), "https://blog.luigi99.cloud/docs");
    assert.equal(buildCanonicalUrl("assets/hello world"), "https://blog.luigi99.cloud/assets/hello%20world");
});

test("builds default SEO metadata with favicon fallback image and Twitter card", () => {
    const metadata = buildDefaultMetadata({ path: "/example", title: "Example | Luigi Log" });

    assert.equal(metadata.title, "Example | Luigi Log");
    assert.equal(metadata.description, "It's Me! Luigi");
    assert.equal(metadata.url, "https://blog.luigi99.cloud/example");
    assert.equal(metadata.image, "https://blog.luigi99.cloud/web-app-manifest-512x512.png");
    assert.equal(metadata.twitterCard, "summary_large_image");
    assert.equal(metadata.type, "website");
});

test("extracts readable post descriptions from markdown body", () => {
    const description = extractPlainTextDescription("# Title\n\n![alt](image.png)\nThis is **bold** copy with `code` and [a link](https://example.com).", 60);

    assert.equal(description, "Title This is bold copy with code and a link.");
});

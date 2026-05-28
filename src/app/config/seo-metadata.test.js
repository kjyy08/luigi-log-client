import test from "node:test";
import assert from "node:assert/strict";

import { getRouteMetadata } from "./seo-metadata.ts";

test("maps app routes to route-specific default SEO metadata", () => {
    assert.equal(getRouteMetadata("/blog").title, "Blog | Luigi Log");
    assert.equal(getRouteMetadata("/portfolio").title, "Portfolio | Luigi Log");
    assert.equal(getRouteMetadata("/guestbook").title, "Guestbook | Luigi Log");
    assert.equal(getRouteMetadata("/settings/profile").title, "Settings | Luigi Log");
    assert.equal(getRouteMetadata("/write").title, "Write | Luigi Log");
    assert.equal(getRouteMetadata("/new").title, "Write | Luigi Log");
});

test("uses the shared default description for route metadata", () => {
    assert.equal(getRouteMetadata("/blog").description, "It's Me! Luigi");
    assert.equal(getRouteMetadata("/unknown").title, "Luigi Log");
    assert.equal(getRouteMetadata("/unknown").url, "https://blog.luigi99.cloud/unknown");
});

import test from "node:test";
import assert from "node:assert/strict";

import { renderCrawlerHtml, renderSitemapXml, isLinkPreviewCrawler } from "./seo-response.js";

test("detects common link preview crawlers that do not execute SPA JavaScript", () => {
    assert.equal(isLinkPreviewCrawler("Mozilla/5.0 Discordbot/2.0"), true);
    assert.equal(isLinkPreviewCrawler("facebookexternalhit/1.1"), true);
    assert.equal(isLinkPreviewCrawler("Mozilla/5.0 Chrome/120 Safari/537.36"), false);
});

test("renders bot-safe post HTML with OG and Twitter metadata", () => {
    const html = renderCrawlerHtml({
        username: "kjyy08",
        slug: "seo-og",
        post: {
            title: "SEO + OG MVP",
            description: "Link previews for Discord.",
            tags: ["seo"],
            createdAt: "2026-05-28T00:00:00.000Z",
            updatedAt: "2026-05-28T01:00:00.000Z",
        },
    });

    assert.match(html, /<title>SEO \+ OG MVP \| Luigi Log<\/title>/);
    assert.match(html, /<meta property="og:type" content="article" \/>/);
    assert.match(html, /<meta property="og:url" content="https:\/\/blog\.luigi99\.cloud\/posts\/kjyy08\/seo-og" \/>/);
    assert.match(html, /<meta property="og:image" content="https:\/\/blog\.luigi99\.cloud\/web-app-manifest-512x512\.png" \/>/);
    assert.match(html, /<meta name="twitter:card" content="summary_large_image" \/>/);
    assert.match(html, /<meta property="article:tag" content="seo" \/>/);
});

test("escapes crawler HTML metadata values", () => {
    const html = renderCrawlerHtml({
        username: "kjyy08",
        slug: "xss",
        post: {
            title: "<script>alert(1)</script>",
            description: "A & B \"quote\"",
            tags: [],
        },
    });

    assert.doesNotMatch(html, /<script>alert/);
    assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
    assert.match(html, /A &amp; B &quot;quote&quot;/);
});

test("renders dynamic sitemap XML for fetched posts plus core routes", () => {
    const xml = renderSitemapXml([
        {
            author: { username: "kjyy08" },
            slug: "seo-og",
            updatedAt: "2026-05-28T01:00:00.000Z",
            createdAt: "2026-05-28T00:00:00.000Z",
        },
    ]);

    assert.match(xml, /<loc>https:\/\/blog\.luigi99\.cloud\/<\/loc>/);
    assert.match(xml, /<loc>https:\/\/blog\.luigi99\.cloud\/blog<\/loc>/);
    assert.match(xml, /<loc>https:\/\/blog\.luigi99\.cloud\/posts\/kjyy08\/seo-og<\/loc>/);
    assert.match(xml, /<lastmod>2026-05-28T01:00:00.000Z<\/lastmod>/);
});

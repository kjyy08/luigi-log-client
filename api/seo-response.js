const runtimeEnv = globalThis.process?.env ?? {};

export const SITE_ORIGIN = runtimeEnv.SITE_ORIGIN || "https://blog.luigi99.cloud";
export const API_BASE_URL = runtimeEnv.BLOG_API_BASE_URL || runtimeEnv.VITE_API_BASE_URL || "https://blog-server.luigi99.cloud";
export const SITE_NAME = "Luigi Log";
export const DEFAULT_DESCRIPTION = "It's Me! Luigi";
export const DEFAULT_OG_IMAGE_PATH = "/web-app-manifest-512x512.png";

const CRAWLER_USER_AGENT_PATTERN = /Discordbot|facebookexternalhit|Facebot|Twitterbot|LinkedInBot|Slackbot|TelegramBot|WhatsApp|KakaoTalk|Googlebot|bingbot|DuckDuckBot/i;

export const isLinkPreviewCrawler = (userAgent = "") => CRAWLER_USER_AGENT_PATTERN.test(userAgent);

export const buildCanonicalUrl = (path = "/") => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return new URL(normalizedPath, SITE_ORIGIN).toString();
};

export const escapeHtml = (value = "") => String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const extractPlainTextDescription = (markdown = "", maxLength = 160) => {
    const plainText = String(markdown)
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/`([^`]+)`/g, "$1")
        .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
        .replace(/^#{1,6}\s+/gm, "")
        .replace(/[*_~>#-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    if (!plainText) return DEFAULT_DESCRIPTION;
    if (plainText.length <= maxLength) return plainText;

    const truncated = plainText.slice(0, maxLength - 1).trimEnd();
    const lastSpace = truncated.lastIndexOf(" ");
    return `${lastSpace > 80 ? truncated.slice(0, lastSpace) : truncated}…`;
};

export const buildDefaultMetadata = ({ path = "/", title = SITE_NAME, description = DEFAULT_DESCRIPTION } = {}) => ({
    title,
    description,
    url: buildCanonicalUrl(path),
    image: buildCanonicalUrl(DEFAULT_OG_IMAGE_PATH),
    siteName: SITE_NAME,
    type: "website",
    twitterCard: "summary_large_image",
});

export const buildPostMetadata = ({ username, slug, post }) => ({
    ...buildDefaultMetadata({
        path: `/posts/${username}/${slug}`,
        title: `${post.title} | ${SITE_NAME}`,
        description: post.description || extractPlainTextDescription(post.body),
    }),
    type: "article",
    tags: post.tags || [],
    publishedTime: post.createdAt,
    modifiedTime: post.updatedAt,
});

const metaTag = (attributes) => {
    const serialized = Object.entries(attributes)
        .filter(([, value]) => value !== undefined && value !== null && value !== "")
        .map(([key, value]) => `${key}="${escapeHtml(value)}"`)
        .join(" ");
    return `<meta ${serialized} />`;
};

export const renderCrawlerHtml = ({ username, slug, post }) => {
    const metadata = buildPostMetadata({ username, slug, post });
    const tags = [
        metaTag({ name: "description", content: metadata.description }),
        metaTag({ property: "og:site_name", content: metadata.siteName }),
        metaTag({ property: "og:type", content: metadata.type }),
        metaTag({ property: "og:title", content: metadata.title }),
        metaTag({ property: "og:description", content: metadata.description }),
        metaTag({ property: "og:url", content: metadata.url }),
        metaTag({ property: "og:image", content: metadata.image }),
        metaTag({ property: "article:published_time", content: metadata.publishedTime }),
        metaTag({ property: "article:modified_time", content: metadata.modifiedTime }),
        metaTag({ name: "twitter:card", content: metadata.twitterCard }),
        metaTag({ name: "twitter:title", content: metadata.title }),
        metaTag({ name: "twitter:description", content: metadata.description }),
        metaTag({ name: "twitter:image", content: metadata.image }),
        ...(metadata.tags || []).map((tag) => metaTag({ property: "article:tag", content: tag })),
    ].join("\n    ");

    return `<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="canonical" href="${escapeHtml(metadata.url)}" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <title>${escapeHtml(metadata.title)}</title>
    ${tags}
</head>
<body>
    <main>
        <h1>${escapeHtml(post.title)}</h1>
        <p>${escapeHtml(metadata.description)}</p>
        <p><a href="${escapeHtml(metadata.url)}">Read on Luigi Log</a></p>
    </main>
</body>
</html>`;
};

const sitemapUrl = (loc, lastmod) => [
    "  <url>",
    `    <loc>${escapeHtml(loc)}</loc>`,
    lastmod ? `    <lastmod>${escapeHtml(lastmod)}</lastmod>` : null,
    "  </url>",
].filter(Boolean).join("\n");

export const renderSitemapXml = (posts = []) => {
    const coreRoutes = ["/", "/blog", "/portfolio", "/guestbook"];
    const urls = coreRoutes.map((path) => sitemapUrl(buildCanonicalUrl(path)));

    for (const post of posts) {
        const username = post.author?.username;
        if (!username || !post.slug) continue;
        urls.push(sitemapUrl(
            buildCanonicalUrl(`/posts/${username}/${post.slug}`),
            post.updatedAt || post.createdAt,
        ));
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
};

export const fetchPostBySlug = async (username, slug) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/posts/@${encodeURIComponent(username)}/${encodeURIComponent(slug)}`);
    if (!response.ok) throw new Error(`Post fetch failed: ${response.status}`);
    const payload = await response.json();
    return payload.data;
};

export const fetchPublishedPosts = async () => {
    const posts = [];
    let cursor;

    for (let page = 0; page < 10; page += 1) {
        const params = new URLSearchParams({ status: "PUBLISHED", limit: "100" });
        if (cursor) params.set("cursor", cursor);
        const response = await fetch(`${API_BASE_URL}/api/v1/posts?${params.toString()}`);
        if (!response.ok) throw new Error(`Post list fetch failed: ${response.status}`);
        const payload = await response.json();
        const pagePosts = payload.data?.posts || [];
        posts.push(...pagePosts);
        cursor = payload.data?.pageInfo?.nextCursor;
        if (!payload.data?.pageInfo?.hasNext || !cursor) break;
    }

    return posts;
};

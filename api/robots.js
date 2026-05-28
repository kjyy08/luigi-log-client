import { SITE_ORIGIN } from "./seo-response.js";

export default function handler(_request, response) {
    response.setHeader("Content-Type", "text/plain; charset=utf-8");
    response.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    response.status(200).send([
        "User-agent: *",
        "Allow: /",
        "Disallow: /settings",
        "Disallow: /write",
        "Disallow: /new",
        "Disallow: /oauth/",
        `Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
        "",
    ].join("\n"));
}

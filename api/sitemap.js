import { fetchPublishedPosts, renderSitemapXml } from "./seo-response.js";

export default async function handler(_request, response) {
    try {
        const posts = await fetchPublishedPosts();
        response.setHeader("Content-Type", "application/xml; charset=utf-8");
        response.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
        response.status(200).send(renderSitemapXml(posts));
    } catch (error) {
        console.error(error);
        response.setHeader("Content-Type", "application/xml; charset=utf-8");
        response.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=3600");
        response.status(200).send(renderSitemapXml());
    }
}

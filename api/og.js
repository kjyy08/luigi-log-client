import { fetchPostBySlug, renderCrawlerHtml } from "./seo-response.js";

export default async function handler(request, response) {
    const { username, slug } = request.query;

    if (!username || !slug) {
        response.status(400).send("Missing username or slug");
        return;
    }

    try {
        const post = await fetchPostBySlug(String(username), String(slug));
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=86400");
        response.status(200).send(renderCrawlerHtml({
            username: String(username),
            slug: String(slug),
            post,
        }));
    } catch (error) {
        console.error(error);
        response.status(404).send("Post not found");
    }
}

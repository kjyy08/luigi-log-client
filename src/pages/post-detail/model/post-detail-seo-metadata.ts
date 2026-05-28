import {
    buildDefaultMetadata,
    extractPlainTextDescription,
    SITE_NAME,
    type SeoMetadata,
} from "../../../shared/seo/metadata.ts";

interface PostDetailMetadataInput {
    username: string;
    slug: string;
    post: {
        title: string;
        description?: string;
        body?: string;
        tags?: string[];
        createdAt?: string;
        updatedAt?: string;
    };
}

export const buildPostDetailMetadata = ({ username, slug, post }: PostDetailMetadataInput): SeoMetadata => ({
    ...buildDefaultMetadata({
        path: `/posts/${username}/${slug}`,
        title: `${post.title} | ${SITE_NAME}`,
        description: post.description || extractPlainTextDescription(post.body),
    }),
    type: "article",
    tags: post.tags ?? [],
    publishedTime: post.createdAt,
    modifiedTime: post.updatedAt,
});

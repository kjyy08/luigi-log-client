export const POST_API_BASE = '/api/v1/posts';

export const postApiEndPoint = {
    list: () => `${POST_API_BASE}`,
    create: () => `${POST_API_BASE}`,
    detail: (id: string) => `${POST_API_BASE}/${id}`,
    update: (id: string) => `${POST_API_BASE}/${id}`,
    delete: (id: string) => `${POST_API_BASE}/${id}`,
    bySlug: (username: string, slug: string) => `${POST_API_BASE}/@${username}/${slug}`,
};

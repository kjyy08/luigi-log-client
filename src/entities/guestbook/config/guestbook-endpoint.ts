export const guestbookApiEndPoint = {
    list: () => '/api/v1/guestbooks',
    create: () => '/api/v1/guestbooks',
    update: (id: string) => `/api/v1/guestbooks/${id}`,
    delete: (id: string) => `/api/v1/guestbooks/${id}`,
} as const;

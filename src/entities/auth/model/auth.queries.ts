import { queryOptions } from '@tanstack/react-query';
import { getMyCredentials } from '../api/auth.api';

export const authQueries = {
    all: () => ['auth'] as const,
    credentials: () => [...authQueries.all(), 'credentials'] as const,
    me: () =>
        queryOptions({
            queryKey: authQueries.credentials(),
            queryFn: getMyCredentials,
        }),
};

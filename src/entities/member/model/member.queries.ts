import { queryOptions } from '@tanstack/react-query';
import { getMember, getMyMemberInfo } from '../api/member.api';

export const memberQueries = {
    all: () => ['member'] as const,
    details: () => [...memberQueries.all(), 'detail'] as const,
    detail: (memberId: string) =>
        queryOptions({
            queryKey: [...memberQueries.details(), memberId] as const,
            queryFn: () => getMember(memberId),
        }),
    me: () =>
        queryOptions({
            queryKey: [...memberQueries.all(), 'me'] as const,
            queryFn: getMyMemberInfo,
        }),
};

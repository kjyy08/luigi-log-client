
const VERSION_PREFIX = '/api/v1/auth';

export const authApiEndPoint = {
    reissue: () => `${VERSION_PREFIX}/tokens/reissue`,
    logout: () => `${VERSION_PREFIX}/tokens/logout`,
    me: () => `${VERSION_PREFIX}/credentials/me`,
    deleteMember: () => '/api/v1/members',
};

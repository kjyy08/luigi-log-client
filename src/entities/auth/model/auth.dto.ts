export interface CredentialsResponse {
    credentialsId: string;
    memberId: string;
    oauthProvider: string;
    oauthProviderId: string;
    role: 'USER' | 'ADMIN';
    lastLoginAt: string;
}

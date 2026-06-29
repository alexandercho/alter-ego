const ALLOWED_GOOGLE_EMAIL = 'alexanderswcho@gmail.com';

type GoogleTokenPayload = {
    aud?: unknown;
    email?: unknown;
    email_verified?: unknown;
    exp?: unknown;
    iss?: unknown;
    sub?: unknown;
};

type VerifiedGoogleToken = {
    email: string;
    subject: string;
};

type GoogleTokenInfoResponse = GoogleTokenPayload & {
    error?: unknown;
    error_description?: unknown;
};

const GOOGLE_TOKEN_INFO_URL = 'https://oauth2.googleapis.com/tokeninfo';
const GOOGLE_ISSUERS = new Set(['accounts.google.com', 'https://accounts.google.com']);

const getGoogleOAuthClientId = () =>
    process.env.GOOGLE_OAUTH_CLIENT_ID
    ?? process.env.GOOGLE_CLIENT_ID
    ?? process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID;

const decodeBase64Url = (value: string) => {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');

    return Buffer.from(padded, 'base64').toString('utf8');
};

const decodeJwtPayload = (token: string): GoogleTokenPayload | undefined => {
    const parts = token.split('.');

    if (parts.length !== 3 || !parts[0] || !parts[1]) {
        return undefined;
    }

    try {
        const payload = JSON.parse(decodeBase64Url(parts[1])) as unknown;

        if (payload && typeof payload === 'object') {
            return payload as GoogleTokenPayload;
        }
    } catch {
        return undefined;
    }

    return undefined;
};

const isEmailVerified = (value: unknown) => value === true || value === 'true';

const isFutureExpiration = (value: unknown) => {
    if (value === undefined) {
        return true;
    }

    const expirationSeconds = typeof value === 'number' ? value : Number.parseInt(String(value), 10);

    return Number.isFinite(expirationSeconds) && expirationSeconds > Math.floor(Date.now() / 1000);
};

const readVerifiedGoogleIdentity = (
    payload: GoogleTokenPayload,
    expectedAudience: string | undefined,
    options: { requireGoogleIssuer: boolean }
): VerifiedGoogleToken | undefined => {
    if (expectedAudience && payload.aud !== expectedAudience) {
        return undefined;
    }

    if (options.requireGoogleIssuer && !GOOGLE_ISSUERS.has(String(payload.iss ?? ''))) {
        return undefined;
    }

    if (payload.email !== ALLOWED_GOOGLE_EMAIL || !isEmailVerified(payload.email_verified)) {
        return undefined;
    }

    if (!payload.sub || typeof payload.sub !== 'string' || !isFutureExpiration(payload.exp)) {
        return undefined;
    }

    return {
        email: payload.email,
        subject: payload.sub
    };
};

const verifyGoogleTokenInfo = async (token: string, clientId: string) => {
    const url = new URL(GOOGLE_TOKEN_INFO_URL);

    url.searchParams.set('id_token', token);

    const response = await fetch(url);

    if (!response.ok) {
        return undefined;
    }

    const payload = await response.json() as GoogleTokenInfoResponse;

    if (payload.error) {
        return undefined;
    }

    return readVerifiedGoogleIdentity(payload, clientId, { requireGoogleIssuer: true });
};

const verifyUnsignedMockGoogleToken = (token: string) => {
    const payload = decodeJwtPayload(token);

    if (!payload) {
        return undefined;
    }

    return readVerifiedGoogleIdentity(payload, undefined, { requireGoogleIssuer: false });
};

const verifyGoogleAuthToken = async (token: string) => {
    const clientId = getGoogleOAuthClientId();

    if (clientId) {
        return verifyGoogleTokenInfo(token, clientId);
    }

    return verifyUnsignedMockGoogleToken(token);
};

export {
    ALLOWED_GOOGLE_EMAIL,
    verifyGoogleAuthToken
};

export type {
    VerifiedGoogleToken
};

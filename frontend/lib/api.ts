const defaultApiBaseUrl = 'http://localhost:3001';
const defaultMinimumSupportedApiVersion = 'v1';
const apiVersion = process.env.EXPO_PUBLIC_MIN_SUPPORTED_API_VERSION ?? defaultMinimumSupportedApiVersion;
const apiVersionBasePath = `/api/${apiVersion}`;
const defaultAuthEndpoint = `${apiVersionBasePath}/auth/google`;

export const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? defaultApiBaseUrl;
export const currentApiVersion = apiVersion;
export const googleAuthEndpoint = process.env.EXPO_PUBLIC_AUTH_ENDPOINT ?? defaultAuthEndpoint;

type JsonObject = Record<string, unknown>;

type ApiErrorBody = {
    error?: string | {
        message?: string;
    };
};

type HealthResponse = {
    latestSupportedApiVersion?: string;
};

type ApiCompatibility = {
    errorMessage: string | null;
    isSupported: boolean;
    latestSupportedApiVersion: string | null;
};

export type AuthenticatedUser = {
    email: string | null;
    id: string | null;
    name: string | null;
};

export type AuthSession = {
    token: string | null;
    user: AuthenticatedUser;
};

let apiSupportCheckPromise: Promise<ApiCompatibility> | undefined;

const readResponse = async <T = unknown>(response: Response): Promise<T> => {
    const data = await response.json().catch(() => null) as ApiErrorBody | T | null;

    if (!response.ok) {
        const error = (data as ApiErrorBody | null)?.error;
        const message = typeof error === 'string' ? error : error?.message;

        throw new Error(message || 'Request failed.');
    }

    return data as T;
};

export const request = async <T = unknown>(path = '', options: RequestInit = {}) => {
    const response = await fetch(`${apiBaseUrl}${path}`, options);
    return readResponse<T>(response);
};

const apiPath = (path = '') => `${apiVersionBasePath}${path}`;

const requestWithJsonBody = async <T = unknown>(method: string, path = '/', body: JsonObject = {}) =>
    request(path, {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }) as Promise<T>;

export const getHealth = async () => request<HealthResponse>('/health');

export const getApiCompatibility = async () => {
    const health = await getHealth();
    const latestSupportedApiVersion = health.latestSupportedApiVersion ?? null;

    return {
        errorMessage:
            latestSupportedApiVersion === currentApiVersion
                ? null
                : `Unsupported frontend API version ${currentApiVersion}. Upgrade the app to the backend's latest supported API version ${latestSupportedApiVersion ?? 'unknown'}.`,
        isSupported: latestSupportedApiVersion === currentApiVersion,
        latestSupportedApiVersion
    };
};

export const ensureApiSupport = async () => {
    if (!apiSupportCheckPromise) {
        apiSupportCheckPromise = getApiCompatibility();
    }

    return apiSupportCheckPromise;
};

const assertApiSupport = async () => {
    const compatibility = await ensureApiSupport();

    if (!compatibility.isSupported) {
        throw new Error(compatibility.errorMessage ?? 'Unsupported frontend API version.');
    }

    return compatibility;
};

export const getResource = async () => {
    await assertApiSupport();

    return request(apiPath('/resource'));
};

export const postResource = async (body: JsonObject = {}) => {
    await assertApiSupport();

    return requestWithJsonBody('POST', apiPath('/resource'), body);
};

export const putResource = async (body: JsonObject = {}) => {
    await assertApiSupport();

    return requestWithJsonBody('PUT', apiPath('/resource'), body);
};

export const deleteResource = async (body: JsonObject = {}) => {
    await assertApiSupport();

    return requestWithJsonBody('DELETE', apiPath('/resource'), body);
};

const asObject = (value: unknown): Record<string, unknown> => value && typeof value === 'object' ? value as Record<string, unknown> : {};

const firstString = (...values: unknown[]) => values.find((value): value is string => typeof value === 'string' && value.length > 0) ?? null;

const normalizeAuthSession = (responseBody: unknown): AuthSession => {
    const root = asObject(responseBody);
    const data = asObject(root.data);
    const user = asObject(root.user ?? data.user);
    const session = asObject(root.session ?? data.session);

    return {
        token: firstString(root.token, root.accessToken, data.token, data.accessToken, session.token, session.accessToken),
        user: {
            email: firstString(user.email, root.email, data.email),
            id: firstString(user.id, user.userId, user.subject, root.userId, data.userId),
            name: firstString(user.name, user.displayName, root.name, data.name)
        }
    };
};

export const loginWithGoogle = async (idToken: string) => {
    await assertApiSupport();

    const responseBody = await requestWithJsonBody('POST', googleAuthEndpoint, {
        idToken,
        provider: 'google'
    });

    return normalizeAuthSession(responseBody);
};

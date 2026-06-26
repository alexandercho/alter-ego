const defaultApiBaseUrl = 'http://localhost:3001';
const defaultMinimumSupportedApiVersion = 'v1';
const apiVersion = process.env.EXPO_PUBLIC_MIN_SUPPORTED_API_VERSION ?? defaultMinimumSupportedApiVersion;
const apiVersionBasePath = `/api/${apiVersion}`;

export const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? defaultApiBaseUrl;
export const currentApiVersion = apiVersion;

type JsonObject = Record<string, unknown>;

type ApiErrorBody = {
    error?: string;
};

type HealthResponse = {
    latestSupportedApiVersion?: string;
};

type ApiCompatibility = {
    errorMessage: string | null;
    isSupported: boolean;
    latestSupportedApiVersion: string | null;
};

let apiSupportCheckPromise: Promise<ApiCompatibility> | undefined;

const readResponse = async <T = unknown>(response: Response): Promise<T> => {
    const data = await response.json().catch(() => null) as ApiErrorBody | T | null;

    if (!response.ok) {
        throw new Error((data as ApiErrorBody | null)?.error || 'Request failed.');
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

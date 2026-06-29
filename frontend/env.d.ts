declare namespace NodeJS {
    type ProcessEnv = {
        EXPO_PUBLIC_API_BASE_URL?: string;
        EXPO_PUBLIC_AUTH_ENDPOINT?: string;
        EXPO_PUBLIC_GOOGLE_AUTH_SCHEME?: string;
        EXPO_PUBLIC_GOOGLE_ID_TOKEN_PLACEHOLDER?: string;
        EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?: string;
        EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID?: string;
        EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?: string;
        EXPO_PUBLIC_MIN_SUPPORTED_API_VERSION?: string;
    };
}

declare const process: {
    env: NodeJS.ProcessEnv;
};

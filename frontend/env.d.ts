declare namespace NodeJS {
    type ProcessEnv = {
        EXPO_PUBLIC_API_BASE_URL?: string;
        EXPO_PUBLIC_MIN_SUPPORTED_API_VERSION?: string;
    };
}

declare const process: {
    env: NodeJS.ProcessEnv;
};

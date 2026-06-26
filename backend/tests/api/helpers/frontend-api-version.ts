const fs = require('node:fs') as typeof import('node:fs');
const path = require('node:path') as typeof import('node:path');

const envFilePath = path.resolve(__dirname, '../../../../frontend/.env.development');
const fallbackVersion = 'v1';

const getFrontendApiVersion = () => {
    if (!fs.existsSync(envFilePath)) {
        return fallbackVersion;
    }

    const envContents = fs.readFileSync(envFilePath, 'utf8');
    const lines = envContents.split(/\r?\n/u);
    const targetPrefix = 'EXPO_PUBLIC_MIN_SUPPORTED_API_VERSION=';
    const matchingLine = lines.find((line) => line.startsWith(targetPrefix));

    if (!matchingLine) {
        return fallbackVersion;
    }

    return matchingLine.slice(targetPrefix.length).trim() || fallbackVersion;
};

export {
    getFrontendApiVersion
};

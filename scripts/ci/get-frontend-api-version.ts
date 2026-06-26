const fs = require('node:fs') as typeof import('node:fs');
const path = require('node:path') as typeof import('node:path');

const envFilePath = path.resolve(__dirname, '../../frontend/.env.development');
const fallbackVersion = 'v1';

if (!fs.existsSync(envFilePath)) {
    process.stdout.write(fallbackVersion);
    process.exit(0);
}

const envContents = fs.readFileSync(envFilePath, 'utf8');
const lines = envContents.split(/\r?\n/u);
const targetPrefix = 'EXPO_PUBLIC_MIN_SUPPORTED_API_VERSION=';

const matchingLine = lines.find((line) => line.startsWith(targetPrefix));

if (!matchingLine) {
    process.stdout.write(fallbackVersion);
    process.exit(0);
}

process.stdout.write(matchingLine.slice(targetPrefix.length).trim() || fallbackVersion);

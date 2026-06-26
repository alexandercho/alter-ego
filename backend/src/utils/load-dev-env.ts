import fs from 'node:fs';
import path from 'node:path';

const envFilePath = path.resolve(__dirname, '../../.env.development');

type EnvEntry = {
    key: string;
    value: string;
};

const parseEnvLine = (line: string): EnvEntry | null => {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith('#')) {
        return null;
    }

    const separatorIndex = trimmedLine.indexOf('=');

    if (separatorIndex < 1) {
        return null;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const value = trimmedLine.slice(separatorIndex + 1).trim();

    if (!key || process.env[key] !== undefined) {
        return null;
    }

    return { key, value };
};

const loadDevEnv = () => {
    if (!fs.existsSync(envFilePath)) {
        return;
    }

    const fileContents = fs.readFileSync(envFilePath, 'utf8');
    const lines = fileContents.split(/\r?\n/u);

    lines.forEach((line) => {
        const entry = parseEnvLine(line);

        if (!entry) {
            return;
        }

        process.env[entry.key] = entry.value;
    });
};

export default loadDevEnv;

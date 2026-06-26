const { spawnSync } = require('node:child_process') as typeof import('node:child_process');

const readVersion = (scriptPath: string) => {
    const result = spawnSync(process.execPath, ['--experimental-strip-types', scriptPath], {
        encoding: 'utf8'
    });

    if (result.status !== 0) {
        throw new Error(result.stderr || `Failed to read version with ${scriptPath}.`);
    }

    return result.stdout.trim();
};

const backendApiVersion = readVersion('scripts/ci/get-backend-api-version.ts');
const frontendApiVersion = readVersion('scripts/ci/get-frontend-api-version.ts');

if (backendApiVersion !== frontendApiVersion) {
    throw new Error(
        `Frontend minimum supported API version ${frontendApiVersion} does not match backend API version ${backendApiVersion}.`
    );
}

process.stdout.write(`Matched API version ${backendApiVersion}\n`);

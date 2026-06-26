const fs = require('node:fs') as typeof import('node:fs');
const { execFileSync } = require('node:child_process') as typeof import('node:child_process');

const baseRef = process.argv[2];
const requireAnyIncrement = process.argv.includes('--require-any');
const allowInitialVersions = process.argv.includes('--allow-initial-versions');

if (!baseRef) {
    throw new Error('A git ref or commit SHA to compare against is required.');
}

type JsonRecord = Record<string, unknown>;

type VersionTarget = {
    key: 'backend' | 'frontendApp' | 'frontendPackage';
    filePath: string;
    propertyPath: string;
};

type VersionDetails = {
    baseVersion: string;
    currentVersion: string;
    incremented: boolean;
};

const versionTargets: VersionTarget[] = [
    {
        key: 'backend',
        filePath: 'backend/package.json',
        propertyPath: 'version'
    },
    {
        key: 'frontendPackage',
        filePath: 'frontend/package.json',
        propertyPath: 'version'
    },
    {
        key: 'frontendApp',
        filePath: 'frontend/app.json',
        propertyPath: 'expo.version'
    }
];

const readJsonFromWorktree = (filePath: string): JsonRecord => JSON.parse(fs.readFileSync(filePath, 'utf8'));

const readJsonFromRef = (ref: string, filePath: string): JsonRecord =>
    JSON.parse(execFileSync('git', ['show', `${ref}:${filePath}`], { encoding: 'utf8' }));

const getValueAtPath = (object: JsonRecord, propertyPath: string) =>
    propertyPath.split('.').reduce<unknown>(
        (currentValue, segment) =>
            typeof currentValue === 'object' && currentValue !== null
                ? (currentValue as JsonRecord)[segment]
                : undefined,
        object
    );

const parseVersion = (version: string) => version
    .split('.')
    .map((segment) => Number.parseInt(segment, 10));

const compareVersions = (leftVersion: string, rightVersion: string) => {
    const leftParts = parseVersion(leftVersion);
    const rightParts = parseVersion(rightVersion);
    const maxLength = Math.max(leftParts.length, rightParts.length);

    for (let index = 0; index < maxLength; index += 1) {
        const leftPart = leftParts[index] ?? 0;
        const rightPart = rightParts[index] ?? 0;

        if (leftPart > rightPart) {
            return 1;
        }

        if (leftPart < rightPart) {
            return -1;
        }
    }

    return 0;
};

const getVersionDetails = ({ filePath, propertyPath }: VersionTarget): VersionDetails => {
    const currentJson = readJsonFromWorktree(filePath);
    const baseJson = readJsonFromRef(baseRef, filePath);
    const currentVersion = getValueAtPath(currentJson, propertyPath);
    const baseVersion = getValueAtPath(baseJson, propertyPath);

    if (typeof currentVersion !== 'string' || typeof baseVersion !== 'string') {
        throw new Error(`Unable to read ${propertyPath} from ${filePath}.`);
    }

    return {
        baseVersion,
        currentVersion,
        incremented: compareVersions(currentVersion, baseVersion) === 1
    };
};

const targetResults = versionTargets.reduce<Record<VersionTarget['key'], VersionDetails>>((results, target) => {
    results[target.key] = getVersionDetails(target);
    return results;
}, {} as Record<VersionTarget['key'], VersionDetails>);

const frontendIncremented = targetResults.frontendPackage.incremented && targetResults.frontendApp.incremented;
const anyIncremented = targetResults.backend.incremented || frontendIncremented;
const allBaseVersionsAreInitial = Object.values(targetResults)
    .every((targetResult) => targetResult.baseVersion === '1.0.0');
const incrementRequirementSatisfied = anyIncremented || (allowInitialVersions && allBaseVersionsAreInitial);

const outputs = {
    backend_incremented: String(targetResults.backend.incremented),
    frontend_package_incremented: String(targetResults.frontendPackage.incremented),
    frontend_app_incremented: String(targetResults.frontendApp.incremented),
    frontend_incremented: String(frontendIncremented),
    any_incremented: String(anyIncremented),
    all_base_versions_are_initial: String(allBaseVersionsAreInitial),
    increment_requirement_satisfied: String(incrementRequirementSatisfied)
};

const githubOutputFile = process.env.GITHUB_OUTPUT;

if (githubOutputFile) {
    const outputLines = Object.entries(outputs)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

    fs.appendFileSync(githubOutputFile, `${outputLines}\n`);
}

process.stdout.write(
    [
        `Compared current worktree against ${baseRef}.`,
        `Backend version: ${targetResults.backend.baseVersion} -> ${targetResults.backend.currentVersion} (${outputs.backend_incremented})`,
        `Frontend package version: ${targetResults.frontendPackage.baseVersion} -> ${targetResults.frontendPackage.currentVersion} (${outputs.frontend_package_incremented})`,
        `Frontend app version: ${targetResults.frontendApp.baseVersion} -> ${targetResults.frontendApp.currentVersion} (${outputs.frontend_app_incremented})`,
        `Frontend release incremented: ${outputs.frontend_incremented}`,
        `Any release incremented: ${outputs.any_incremented}`,
        `All base versions are initial: ${outputs.all_base_versions_are_initial}`,
        `Increment requirement satisfied: ${outputs.increment_requirement_satisfied}`
    ].join('\n') + '\n'
);

if (requireAnyIncrement && !incrementRequirementSatisfied) {
    throw new Error(
        'At least one production target must be version-incremented before releasing. Increment backend/package.json or both frontend/package.json and frontend/app.json.'
    );
}

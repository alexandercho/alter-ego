import { createRequire } from 'node:module';

const packageRequire = createRequire(__filename);
const { version } = packageRequire('../../package.json') as { version: string };

const getCurrentApiVersion = () => {
    const majorVersion = Number.parseInt(version.split('.')[0] ?? '', 10);

    if (!Number.isInteger(majorVersion) || majorVersion <= 0) {
        return 'v1';
    }

    return `v${majorVersion}`;
};

export {
    getCurrentApiVersion
};

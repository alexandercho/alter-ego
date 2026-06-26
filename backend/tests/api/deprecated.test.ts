const test = require('node:test') as typeof import('node:test');
import { getCurrentApiVersion } from '#utils/api-version';

import { requestJson, startApiTestServer } from './helpers/api-test-server';
import { getDeprecatedApiCases } from './helpers/deprecated-api-cases';
import { assertDeprecatedApiCase } from './helpers/deprecated-api-assertions';

const currentApiVersion = getCurrentApiVersion();
const deprecatedApiCases = getDeprecatedApiCases();

if (deprecatedApiCases.length === 0) {
    test('deprecated API request coverage is intentionally empty until a deprecated version exists', () => {});
}

for (const testCase of deprecatedApiCases) {
    test(
        `deprecated ${testCase.version} ${testCase.method} ${testCase.path} should fail intentionally`,
        async (t) => {
            const server = await startApiTestServer();

            t.after(async () => {
                await server.close();
            });

            await assertDeprecatedApiCase({
                baseUrl: server.baseUrl,
                expectedCurrentApiVersion: currentApiVersion,
                requestJson,
                testCase
            });
        }
    );
}

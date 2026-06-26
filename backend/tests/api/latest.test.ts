const test = require('node:test') as typeof import('node:test');
import { startApiTestServer, requestJson } from './helpers/api-test-server';
import {
    assertHealthyBackend,
    assertResourceCrudContract
} from './helpers/api-contract-assertions';
import { getCurrentApiVersion } from '#utils/api-version';

const currentApiVersion = getCurrentApiVersion();
const latestResourcePath = `/api/${currentApiVersion}/resource`;

test('latest API health requests should work', async (t) => {
    const server = await startApiTestServer();

    t.after(async () => {
        await server.close();
    });

    await assertHealthyBackend({
        baseUrl: server.baseUrl,
        expectedApiVersion: currentApiVersion,
        requestJson
    });
});

test('latest API resource requests should work', async (t) => {
    const server = await startApiTestServer();

    t.after(async () => {
        await server.close();
    });

    await assertResourceCrudContract({
        baseUrl: server.baseUrl,
        payloadPrefix: 'latest-resource',
        requestJson,
        resourcePath: latestResourcePath
    });
});

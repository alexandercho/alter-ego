const test = require('node:test') as typeof import('node:test');
import { startApiTestServer, requestJson } from './helpers/api-test-server';
import {
    assertHealthyBackend,
    assertResourceCrudContract
} from './helpers/api-contract-assertions';
import { getFrontendApiVersion } from './helpers/frontend-api-version';

const frontendApiVersion = getFrontendApiVersion();
const frontendResourcePath = `/api/${frontendApiVersion}/resource`;

test('current frontend health request is supported by the backend', async (t) => {
    const server = await startApiTestServer();

    t.after(async () => {
        await server.close();
    });

    await assertHealthyBackend({
        baseUrl: server.baseUrl,
        expectedApiVersion: frontendApiVersion,
        requestJson
    });
});

test('current frontend compatibility check still matches the current API version', async (t) => {
    const server = await startApiTestServer();

    t.after(async () => {
        await server.close();
    });

    await assertHealthyBackend({
        baseUrl: server.baseUrl,
        expectedApiVersion: frontendApiVersion,
        requestJson
    });
});

test('current frontend resource calls are supported by the backend', async (t) => {
    const server = await startApiTestServer();

    t.after(async () => {
        await server.close();
    });

    await assertResourceCrudContract({
        baseUrl: server.baseUrl,
        payloadPrefix: 'frontend-contract',
        requestJson,
        resourcePath: frontendResourcePath
    });
});

const test = require('node:test') as typeof import('node:test');
const assert: typeof import('node:assert/strict') = require('node:assert/strict');
import { startApiTestServer, requestJson } from './helpers/api-test-server';
import {
    assertHealthyBackend,
    assertResourceCrudContract
} from './helpers/api-contract-assertions';
import { getFrontendApiVersion } from './helpers/frontend-api-version';

const frontendApiVersion = getFrontendApiVersion();
const frontendAuthPath = `/api/${frontendApiVersion}/auth/google`;
const frontendResourcePath = `/api/${frontendApiVersion}/resource`;

const createLocalGoogleIdToken = (payload: Record<string, unknown>) => {
    const encode = (value: Record<string, unknown>) =>
        Buffer.from(JSON.stringify(value))
            .toString('base64url');

    return `${encode({ alg: 'none', typ: 'JWT' })}.${encode(payload)}.`;
};

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

test('current frontend Google auth request succeeds for an allowed email', async (t) => {
    const server = await startApiTestServer();

    t.after(async () => {
        await server.close();
    });

    const { body, response } = await requestJson(server.baseUrl, frontendAuthPath, {
        body: JSON.stringify({
            idToken: createLocalGoogleIdToken({
                email: 'alexanderswcho@gmail.com',
                email_verified: true,
                sub: 'alex-google-subject'
            })
        }),
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST'
    });

    assert.equal(response.status, 200);
    assert.deepEqual(body, {
        success: true,
        user: {
            email: 'alexanderswcho@gmail.com',
            subject: 'alex-google-subject'
        }
    });
});

test('current frontend Google auth request returns a structured error for unauthorized email', async (t) => {
    const server = await startApiTestServer();

    t.after(async () => {
        await server.close();
    });

    const { body, response } = await requestJson(server.baseUrl, frontendAuthPath, {
        body: JSON.stringify({
            idToken: createLocalGoogleIdToken({
                email: 'unauthorized@example.com',
                email_verified: true,
                sub: 'unauthorized-google-subject'
            })
        }),
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST'
    });

    assert.equal(response.status, 401);
    assert.deepEqual(body, {
        success: false,
        error: {
            message: 'Invalid Google auth token',
            code: 'UNAUTHORIZED'
        }
    });
});

test('current frontend Google auth request returns a structured error for bad input', async (t) => {
    const server = await startApiTestServer();

    t.after(async () => {
        await server.close();
    });

    const { body, response } = await requestJson(server.baseUrl, frontendAuthPath, {
        body: JSON.stringify({}),
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST'
    });

    assert.equal(response.status, 400);
    assert.deepEqual(body, {
        success: false,
        error: {
            message: 'Invalid request',
            code: 'BAD_REQUEST'
        }
    });
});

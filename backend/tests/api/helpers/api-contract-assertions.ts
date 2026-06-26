const assert: typeof import('node:assert/strict') = require('node:assert/strict');

type RequestJson = (
    baseUrl: string,
    path: string,
    options?: RequestInit
) => Promise<{
    body: Record<string, unknown> | null;
    response: Response;
}>;

type ApiAssertionOptions = {
    baseUrl: string;
    expectedApiVersion: string;
    requestJson: RequestJson;
};

type ResourceCrudOptions = {
    baseUrl: string;
    payloadPrefix: string;
    requestJson: RequestJson;
    resourcePath: string;
};

const assertHealthyBackend = async ({ baseUrl, expectedApiVersion, requestJson }: ApiAssertionOptions) => {
    const { body, response } = await requestJson(baseUrl, '/health');

    assert.equal(response.status, 200);
    assert.ok(body);
    assert.equal(body.service, 'backend');
    assert.equal(body.status, 'ok');
    assert.equal(body.latestSupportedApiVersion, expectedApiVersion);

    return body;
};

const assertResourceCrudContract = async ({ baseUrl, requestJson, resourcePath, payloadPrefix }: ResourceCrudOptions) => {
    const { body: getBody, response: getResponse } = await requestJson(baseUrl, resourcePath);

    assert.equal(getResponse.status, 200);
    assert.deepEqual(getBody, {});

    const methods = ['POST', 'PUT', 'DELETE'];

    for (const method of methods) {
        const { body, response } = await requestJson(baseUrl, resourcePath, {
            body: JSON.stringify({ latestMessage: `${payloadPrefix}-${method.toLowerCase()}` }),
            headers: {
                'Content-Type': 'application/json'
            },
            method
        });

        assert.equal(response.status, 200);
        assert.deepEqual(body, {});
    }
};

export {
    assertHealthyBackend,
    assertResourceCrudContract,
    type RequestJson
};

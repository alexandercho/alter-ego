const assert: typeof import('node:assert/strict') = require('node:assert/strict');

import type { RequestJson } from './api-contract-assertions';
import type { DeprecatedApiCaseWithVersion } from './deprecated-api-cases';

import {
    assertHealthyBackend
} from './api-contract-assertions';

type DeprecatedApiCaseOptions = {
    baseUrl: string;
    expectedCurrentApiVersion: string;
    requestJson: RequestJson;
    testCase: DeprecatedApiCaseWithVersion;
};

const assertDeprecatedApiCase = async ({
    baseUrl,
    expectedCurrentApiVersion,
    requestJson,
    testCase
}: DeprecatedApiCaseOptions) => {
    await assertHealthyBackend({
        baseUrl,
        expectedApiVersion: expectedCurrentApiVersion,
        requestJson
    });

    const requestOptions: RequestInit = {
        method: testCase.method
    };

    if (testCase.body !== undefined) {
        requestOptions.body = JSON.stringify(testCase.body);
        requestOptions.headers = {
            'Content-Type': 'application/json'
        };
    }

    const { body, response } = await requestJson(baseUrl, testCase.path, requestOptions);

    assert.equal(response.status, testCase.expectedStatus);

    if (testCase.expectedError !== undefined) {
        assert.equal(body?.error, testCase.expectedError);
    }

    if (testCase.replacement !== undefined) {
        assert.equal(body?.replacement, testCase.replacement);
    }
};

export {
    assertDeprecatedApiCase
};

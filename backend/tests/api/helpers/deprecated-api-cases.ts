type DeprecatedApiCase = {
    body?: Record<string, unknown>;
    expectedError?: string;
    expectedStatus: number;
    method: string;
    path: string;
    replacement?: string;
};

type DeprecatedApiCaseWithVersion = DeprecatedApiCase & {
    version: string;
};

const deprecatedCasesByVersion: Record<string, DeprecatedApiCase[]> = {
    // Example future shape:
    // v1: [
    //     {
    //         expectedError: 'Deprecated API request.',
    //         expectedStatus: 410,
    //         method: 'GET',
    //         path: '/api/v1/old-resource',
    //         replacement: '/api/v2/resource'
    //     }
    // ]
};

const getDeprecatedApiCases = () =>
    Object.entries(deprecatedCasesByVersion).flatMap(([version, cases]) =>
        cases.map((testCase) => ({
            ...testCase,
            version
        }))
    );

export {
    deprecatedCasesByVersion,
    getDeprecatedApiCases,
    type DeprecatedApiCaseWithVersion
};

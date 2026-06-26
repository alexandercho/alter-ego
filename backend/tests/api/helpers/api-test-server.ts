import type { AddressInfo } from 'node:net';

import app = require('#app');

const startApiTestServer = async () =>
    new Promise<{
        baseUrl: string;
        close: () => Promise<void>;
    }>((resolve, reject) => {
        const server = app.listen(0, () => {
            const { port } = server.address() as AddressInfo;

            resolve({
                baseUrl: `http://127.0.0.1:${port}`,
                close: async () =>
                    new Promise<void>((closeResolve, closeReject) => {
                        server.close((error) => {
                            if (error) {
                                closeReject(error);
                                return;
                            }

                            closeResolve();
                        });
                    })
            });
        });

        server.on('error', reject);
    });

const requestJson = async (baseUrl: string, path: string, options: RequestInit = {}) => {
    const response = await fetch(`${baseUrl}${path}`, options);
    const data = await response.json().catch(() => null) as Record<string, unknown> | null;

    return {
        body: data,
        response
    };
};

export {
    requestJson,
    startApiTestServer
};

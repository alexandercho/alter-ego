import type { Request, Response } from 'express';

import { getCurrentApiVersion } from '#utils/api-version';

const getHealth = (_req: Request, res: Response) =>
    res.json({
        latestSupportedApiVersion: getCurrentApiVersion(),
        service: 'backend',
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptimeSeconds: Number(process.uptime().toFixed(2))
    });

export {
    getHealth
};

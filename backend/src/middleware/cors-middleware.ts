import type { NextFunction, Request, Response } from 'express';

const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    res.set({
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Origin': '*'
    });

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    return next();
};

export default corsMiddleware;

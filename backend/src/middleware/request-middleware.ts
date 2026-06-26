import type { NextFunction, Request, Response } from 'express';

const requestMiddleware = (_req: Request, _res: Response, next: NextFunction) => next();

export default requestMiddleware;

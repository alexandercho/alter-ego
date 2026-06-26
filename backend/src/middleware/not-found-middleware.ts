import type { Request, Response } from 'express';

const notFoundMiddleware = (_req: Request, res: Response) => res.status(404).json({ error: 'Route not found.' });

export default notFoundMiddleware;

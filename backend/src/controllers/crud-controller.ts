import type { Request, Response } from 'express';

import {
    deleteResource as deleteStoredResource,
    getStore,
    postResource as postStoredResource,
    putResource as putStoredResource
} from '#data/store';

const getResource = (_req: Request, res: Response) => res.json(getStore());

const postResource = (req: Request, res: Response) => res.json(postStoredResource(req.body));

const putResource = (req: Request, res: Response) => res.json(putStoredResource(req.body));

const deleteResource = (req: Request, res: Response) => res.json(deleteStoredResource(req.body));

export {
    deleteResource,
    getResource,
    postResource,
    putResource
};

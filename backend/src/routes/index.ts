import express from 'express';

import {
    deleteResource,
    getResource,
    postResource,
    putResource
} from '#controllers/crud-controller';
import {
    getHealth
} from '#controllers/health-controller';
import requestMiddleware from '#middleware/request-middleware';

const router = express.Router();

router.use(requestMiddleware);

router.get('/health', getHealth);

router.route('/api/v1/resource')
    .get(getResource)
    .post(postResource)
    .put(putResource)
    .delete(deleteResource);

export default router;

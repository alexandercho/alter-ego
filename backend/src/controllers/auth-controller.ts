import type { NextFunction, Request, Response } from 'express';

import {
    verifyGoogleAuthToken
} from '#utils/google-auth';

const invalidAuthResponse = (res: Response) => res.status(401).json({
    success: false,
    error: {
        message: 'Invalid Google auth token',
        code: 'UNAUTHORIZED'
    }
});

const invalidRequestResponse = (res: Response) => res.status(400).json({
    success: false,
    error: {
        message: 'Invalid request',
        code: 'BAD_REQUEST'
    }
});

const verifyGoogleAuth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.body?.token ?? req.body?.idToken ?? req.body?.authToken;

    if (typeof token !== 'string' || token.trim().length === 0) {
        return invalidRequestResponse(res);
    }

    try {
        const identity = await verifyGoogleAuthToken(token.trim());

        if (!identity) {
            return invalidAuthResponse(res);
        }

        return res.json({
            success: true,
            user: {
                email: identity.email,
                subject: identity.subject
            }
        });
    } catch (error) {
        return next(error);
    }
};

export {
    verifyGoogleAuth
};

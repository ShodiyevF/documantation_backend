import express from 'express'

import internalErrorCatcher from '@shared/logger/logger.internal'
import ExpressFunctions from '@lib/express.function'
import Exception from '@lib/httpException'
import JWT from '@lib/jwt'

async function authorizationMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const headers = req.headers

        if (!headers) {
            return ExpressFunctions.returnResponse(res, 401, 'AUTHORIZATION ERROR', Exception.Errors.UNAUTHORIZED)
        }
        
        const authorization = headers.authorization

        if (!authorization) {
            return ExpressFunctions.returnResponse(res, 401, 'AUTHORIZATION ERROR', Exception.Errors.UNAUTHORIZED)
        }

        const verifedToken = JWT.verifyJwtToken(authorization)

        if (verifedToken.status === 402) {
            return ExpressFunctions.returnResponse(res, 401, 'AUTHORIZATION ERROR', Exception.Errors.UNAUTHORIZED)
        }

        return next()
    } catch (error) {
        internalErrorCatcher(error)
        return ExpressFunctions.returnResponse(res, 500, 'INTERNAL ERROR', Exception.Errors.INTERNAL_SERVER_ERROR)
    }
}

export default authorizationMiddleware
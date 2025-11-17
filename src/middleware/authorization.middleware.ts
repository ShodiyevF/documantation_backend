import express from 'express'

import internalErrorCatcher from '@shared/logger/logger.internal'
import ExpressFunctions from '@lib/express_functions.lib'
import Exception from '@lib/http_exception.lib'
import JWT from '@lib/jwt.lib'

async function authorizationMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const headers = req.headers
        if (!headers) {
            return ExpressFunctions.returnResponse(res, 401, 'AUTHORIZATION ERROR', Exception.Errors.AUTHORIZATION_ERROR)
        }
        
        const authorization = headers.authorization
        if (!authorization) {
            return ExpressFunctions.returnResponse(res, 401, 'AUTHORIZATION ERROR', Exception.Errors.AUTHORIZATION_ERROR)
        }

        const verifedToken = JWT.verifyJwtToken(authorization)
        if (verifedToken.result !== 'VERIFIED') {
            return ExpressFunctions.returnResponse(res, 401, 'AUTHORIZATION ERROR', Exception.Errors.AUTHORIZATION_ERROR)
        }
        return next()
    } catch (error) {
        internalErrorCatcher(error)
        return ExpressFunctions.returnResponse(res, 500, 'INTERNAL ERROR', Exception.Errors.INTERNAL_SERVER_ERROR)
    }
}

export default authorizationMiddleware
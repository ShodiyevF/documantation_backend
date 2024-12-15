import express from 'express'

import authorizationMiddleware from '@middleware/authorization.middleware'
import validationMiddleware from '@middleware/validator.middleware'
import ApisDto from '@dto/apis.dto'
import ApisCtrl from './apis.ctrl'

const app = express.Router()

app.get('/api/apis/:project_id',
    authorizationMiddleware,
    validationMiddleware(ApisDto.getApisParams, 'params'),
    ApisCtrl.getApis
)

app.post('/api/apis/',
    authorizationMiddleware,
    validationMiddleware(ApisDto.createApiBody, 'body'),
    ApisCtrl.createApi
)

app.post('/api/apis/response',
    authorizationMiddleware,
    validationMiddleware(ApisDto.createApiResponseBody, 'body'),
    ApisCtrl.createApiResponse
)

app.post('/api/apis/payload',
    authorizationMiddleware,
    validationMiddleware(ApisDto.createApiPayloadBody, 'body'),
    ApisCtrl.createApiPayload
)


export default app
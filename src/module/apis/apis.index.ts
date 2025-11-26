import express from 'express'

import authorizationMiddleware from '@middleware/authorization.middleware'
import validationMiddleware from '@middleware/validator.middleware'
import GlobalDto from '@dto/global.dto'
import ApisDto from '@dto/apis.dto'
import ApisCtrl from './apis.ctrl'

const app = express.Router()

app.get('/api/apis/get',
    authorizationMiddleware,
    validationMiddleware(GlobalDto.paginationQuery, 'query'),
    validationMiddleware(ApisDto.getApisQuery, 'query'),
    ApisCtrl.getApis
)

app.get('/api/apis/get/by-id/:api_id',
    authorizationMiddleware,
    validationMiddleware(ApisDto.getApiByIdParams, 'params'),
    ApisCtrl.getApiById
)

app.post('/api/apis/create',
    authorizationMiddleware,
    validationMiddleware(ApisDto.createApiBody, 'body'),
    ApisCtrl.createApi
)

app.patch('/api/apis/update/:api_id',
    authorizationMiddleware,
    validationMiddleware(ApisDto.updateApiParams, 'params'),
    validationMiddleware(ApisDto.updateApiBody, 'body'),
    ApisCtrl.updateApi
)

app.delete('/api/apis/delete/:api_id',
    authorizationMiddleware,
    validationMiddleware(ApisDto.deleteApiParams, 'params'),
    ApisCtrl.deleteApi
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
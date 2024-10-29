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


export default app
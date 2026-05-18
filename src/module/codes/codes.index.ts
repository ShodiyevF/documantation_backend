import express from 'express'

import authorizationMiddleware from '@middleware/authorization.middleware'
import validationMiddleware from '@middleware/validator.middleware'
import GlobalDto from '@dto/global.dto'
import CodesDto from '@dto/codes.dto'
import CodesCtrl from './codes.ctrl'

const app = express.Router()

app.get('/api/codes/get',
    authorizationMiddleware,
    validationMiddleware(GlobalDto.paginationQuery, 'query'),
    validationMiddleware(CodesDto.getCodesQuery, 'query'),
    CodesCtrl.getCodes
)

app.get('/api/codes/get/by-id/:code_id',
    authorizationMiddleware,
    validationMiddleware(CodesDto.getCodeByIdParams, 'params'),
    CodesCtrl.getCodeById
)

app.post('/api/codes/create',
    authorizationMiddleware,
    validationMiddleware(CodesDto.createCodeBody, 'body'),
    CodesCtrl.createCode
)

app.patch('/api/codes/update/:code_id',
    authorizationMiddleware,
    validationMiddleware(CodesDto.updateCodeParams, 'params'),
    validationMiddleware(CodesDto.updateCodeBody, 'body'),
    CodesCtrl.updateCode
)

app.delete('/api/codes/delete/:code_id',
    authorizationMiddleware,
    validationMiddleware(CodesDto.deleteCodeParams, 'params'),
    CodesCtrl.deleteCode
)


export default app
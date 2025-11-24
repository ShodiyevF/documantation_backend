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

app.post('/api/codes/create',
    authorizationMiddleware,
    validationMiddleware(CodesDto.createCodeBody, 'body'),
    CodesCtrl.createCode
)


export default app
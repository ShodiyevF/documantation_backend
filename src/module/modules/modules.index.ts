import express from 'express'

import authorizationMiddleware from '@middleware/authorization.middleware'
import validationMiddleware from '@middleware/validator.middleware'
import ModulesDto from '@dto/modules.dto'
import ModulesCtrl from './modules.ctrl'
import GlobalDto from '@dto/global.dto'

const app = express.Router()

app.get('/api/modules/get',
    authorizationMiddleware,
    validationMiddleware(GlobalDto.paginationQuery, 'query'),
    validationMiddleware(ModulesDto.getModulesQuery, 'query'),
    ModulesCtrl.getModules
)

export default app
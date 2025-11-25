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

app.get('/api/modules/get/by-id/:module_id',
    authorizationMiddleware,
    validationMiddleware(ModulesDto.getModuleByIdParams, 'params'),
    ModulesCtrl.getModuleById
)

app.post('/api/modules/create',
    authorizationMiddleware,
    validationMiddleware(ModulesDto.createModuleBody, 'body'),
    ModulesCtrl.createModule
)

app.patch('/api/modules/update/:module_id',
    authorizationMiddleware,
    validationMiddleware(ModulesDto.updateModuleParams, 'params'),
    validationMiddleware(ModulesDto.updateModuleBody, 'body'),
    ModulesCtrl.updateModule
)

export default app
import express from 'express'

import authorizationMiddleware from '@middleware/authorization.middleware'
import validationMiddleware from '@middleware/validator.middleware'
import ProjectsDto from '@dto/projects.dto'
import ProjectsCtrl from './projects.ctrl'

const app = express.Router()

app.get('/api/projects',
    authorizationMiddleware,
    ProjectsCtrl.getProjects
)

app.post('/api/projects',
    authorizationMiddleware,
    validationMiddleware(ProjectsDto.createProject, 'body'),
    ProjectsCtrl.createProject
)

export default app
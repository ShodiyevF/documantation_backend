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

app.post('/api/projects/create',
    authorizationMiddleware,
    validationMiddleware(ProjectsDto.createProject, 'body'),
    ProjectsCtrl.createProject
)

app.post('/api/projects/invite/users',
    authorizationMiddleware,
    validationMiddleware(ProjectsDto.inviteUsers, 'body'),
    ProjectsCtrl.inviteUsers
)

export default app
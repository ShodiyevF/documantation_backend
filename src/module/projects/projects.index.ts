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

app.get('/api/projects/invitation/get',
    authorizationMiddleware,
    ProjectsCtrl.getProjectInvitations
)

app.post('/api/projects/invitation/create',
    authorizationMiddleware,
    validationMiddleware(ProjectsDto.createProjectInvitations, 'body'),
    ProjectsCtrl.createProjectInvitations
)

app.post('/api/projects/invitation/confirm',
    authorizationMiddleware,
    validationMiddleware(ProjectsDto.confirmProjectInvitation, 'body'),
    ProjectsCtrl.confirmProjectInvitation
)

export default app
import express from 'express'

import authorizationMiddleware from '@middleware/authorization.middleware'
import validationMiddleware from '@middleware/validator.middleware'
import ProjectsDto from '@dto/projects.dto'
import ProjectsCtrl from './projects.ctrl'

const app = express.Router()

app.get('/api/projects/get',
    authorizationMiddleware,
    ProjectsCtrl.getProjects
)

app.post('/api/projects/create',
    authorizationMiddleware,
    validationMiddleware(ProjectsDto.createProject, 'body'),
    ProjectsCtrl.createProject
)

app.patch('/api/projects/update/:project_id',
    authorizationMiddleware,
    validationMiddleware(ProjectsDto.updateProjectParams, 'params'),
    validationMiddleware(ProjectsDto.updateProjectBody, 'body'),
    ProjectsCtrl.updateProject
)

app.delete('/api/projects/delete/:project_id',
    authorizationMiddleware,
    validationMiddleware(ProjectsDto.deleteProjectParams, 'params'),
    ProjectsCtrl.deleteProject
)

app.patch('/api/projects/transfer-ownership',
    authorizationMiddleware,
    validationMiddleware(ProjectsDto.transferProjectOwnershipBody, 'body'),
    ProjectsCtrl.transferProjectOwnership
)

app.get('/api/projects/invitation/get',
    authorizationMiddleware,
    ProjectsCtrl.getProjectInvitations
)

app.post('/api/projects/invitation/create',
    authorizationMiddleware,
    validationMiddleware(ProjectsDto.createProjectInvitationsBody, 'body'),
    ProjectsCtrl.createProjectInvitations
)

app.post('/api/projects/invitation/confirm',
    authorizationMiddleware,
    validationMiddleware(ProjectsDto.confirmProjectInvitationBody, 'body'),
    ProjectsCtrl.confirmProjectInvitation
)

app.post('/api/projects/leave',
    authorizationMiddleware,
    validationMiddleware(ProjectsDto.leaveProjectBody, 'body'),
    ProjectsCtrl.leaveProject
)

app.post('/api/projects/remove-user',
    authorizationMiddleware,
    validationMiddleware(ProjectsDto.removeProjectUserBody, 'body'),
    ProjectsCtrl.removeProjectUser
)

export default app
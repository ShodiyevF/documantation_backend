import express from 'express'

import authorizationMiddleware from '@middleware/authorization.middleware'
import ProjectsCtrl from './projects.ctrl'


const app = express.Router()

app.get('/api/projects',
    authorizationMiddleware,
    ProjectsCtrl.projects
)


export default app
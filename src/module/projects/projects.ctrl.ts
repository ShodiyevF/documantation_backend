import express from 'express'

import controllerError from '@lib/controllerError'
import ProjectsModel from './projects.model'

namespace ProjectsCtrl {

    export async function projects(req: express.Request, res: express.Response) {
        try {
            const model = await ProjectsModel.projects(req.headers.authorization as string)

            return res.status(200).json(model)
        } catch (error) {
            controllerError(res, error)
        }
    }
    
}

export default ProjectsCtrl
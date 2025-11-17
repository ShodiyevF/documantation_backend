import express from 'express'


import ProjectsModel from './projects.model'
import ExpressFunctions from '@lib/express_functions.lib'

namespace ProjectsCtrl {

    export async function projects(req: express.Request, res: express.Response) {
        try {
            const model = await ProjectsModel.projects(req.headers.authorization as string)

            return res.status(200).json(model)
        } catch (error) {
            ExpressFunctions.controllerError(res, error)
        }
    }

    export async function createProject(req: express.Request, res: express.Response) {
        try {
            await ProjectsModel.createProject(req.body, req.headers.authorization as string)

            return res.status(201).json({
                status: 201,
                message: 'Project succesfully created'
            })
        } catch (error) {
            ExpressFunctions.controllerError(res, error)
        }
    }
    
}

export default ProjectsCtrl
import express from 'express'

import ExpressFunctions from '@lib/express_functions.lib'
import ProjectsModel from './projects.model'

namespace ProjectsCtrl {

    export async function getProjects(req: express.Request, res: express.Response) {
        try {
            const model = await ProjectsModel.getProjects(req.headers.authorization!)

            return res.status(200).json(model)
        } catch (error) {
            ExpressFunctions.controllerError(res, error)
        }
    }

    export async function createProject(req: express.Request, res: express.Response) {
        try {
            await ProjectsModel.createProject(req.body, req.headers.authorization!)

            return res.status(201).json({
                status: 201,
                message: 'Project succesfully created'
            })
        } catch (error) {
            ExpressFunctions.controllerError(res, error)
        }
    }

    export async function updateProject(req: express.Request, res: express.Response) {
        try {
            await ProjectsModel.updateProject(req.body, req.params.project_id, req.headers.authorization!)

            return res.status(200).json({
                status: 200,
                message: 'Project succesfully updated'
            })
        } catch (error) {
            ExpressFunctions.controllerError(res, error)
        }
    }

    export async function getProjectInvitations(req: express.Request, res: express.Response) {
        try {
            const model = await ProjectsModel.getProjectInvitations(req.headers.authorization!)

            return res.status(200).json(model)
        } catch (error) {
            ExpressFunctions.controllerError(res, error)
        }
    }

    export async function createProjectInvitations(req: express.Request, res: express.Response) {
        try {
            await ProjectsModel.createProjectInvitations(req.body, req.headers.authorization!)

            return res.status(200).json({
                status: 200,
                message: 'Project invitations successfully created'
            })
        } catch (error) {
            ExpressFunctions.controllerError(res, error)
        }
    }

    export async function confirmProjectInvitation(req: express.Request, res: express.Response) {
        try {
            await ProjectsModel.confirmProjectInvitation(req.body, req.headers.authorization!)

            return res.status(200).json({
                status: 200,
                message: 'Project invitations successfully created'
            })
        } catch (error) {
            ExpressFunctions.controllerError(res, error)
        }
    }
    
}

export default ProjectsCtrl
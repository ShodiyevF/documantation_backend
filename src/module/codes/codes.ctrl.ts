import express from 'express'

import ExpressFunctions from '@lib/express_functions.lib'
import CodesInterface from '@interface/codes.interface'
import CodesModel from './codes.model'

namespace CodesCtrl {

    export async function getCodes(req: express.Request, res: express.Response) {
        try {
            const query: CodesInterface.IGetCodesQuery = {
                limit: +req.query.limit!,
                page: +req.query.page!,
                project_id: req.query.project_id! as string
            }
            
            const model = await CodesModel.getCodes(query, req.headers.authorization!)

            return res.status(200).json(model)
        } catch (error) {
            ExpressFunctions.controllerError(res, error)
        }
    }

    export async function getCodeById(req: express.Request, res: express.Response) {
        try {
            const model = await CodesModel.getCodeById(req.params.code_id, req.headers.authorization!)

            return res.status(200).json(model)
        } catch (error) {
            ExpressFunctions.controllerError(res, error)
        }
    }

    export async function createCode(req: express.Request, res: express.Response) {
        try {
            await CodesModel.createCode(req.body, req.headers.authorization!)

            return res.status(201).json({
                status: 201,
                message: 'Code successfully created'
            })
        } catch (error) {
            ExpressFunctions.controllerError(res, error)
        }
    }

    export async function updateCode(req: express.Request, res: express.Response) {
        try {
            await CodesModel.updateCode(req.body, req.params.code_id, req.headers.authorization!)

            return res.status(200).json({
                status: 200,
                message: 'Code successfully updated'
            })
        } catch (error) {
            ExpressFunctions.controllerError(res, error)
        }
    }

    export async function deleteCode(req: express.Request, res: express.Response) {
        try {
            await CodesModel.deleteCode(req.params.code_id, req.headers.authorization!)

            return res.status(200).json({
                status: 200,
                message: 'Code successfully deleted'
            })
        } catch (error) {
            ExpressFunctions.controllerError(res, error)
        }
    }
    
}

export default CodesCtrl
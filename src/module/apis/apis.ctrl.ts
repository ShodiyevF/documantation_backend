import express from 'express'

import ExpressFunctions from '@lib/express_functions.lib'
import ApisModel from './apis.model'

namespace ApisCtrl {

    export async function getApis(req: express.Request, res: express.Response) {
        try {
            const model = await ApisModel.getApis({
                projectId: req.params.project_id
            }, req.headers.authorization!)

            return res.status(200).json(model)
        } catch (error) {
            ExpressFunctions.controllerError(res, error)
        }
    }

    export async function createApi(req: express.Request, res: express.Response) {
        try {
            await ApisModel.createApi(req.body, req.headers.authorization!)

            return res.status(201).json({
                status: 201,
                message: 'Api successfully created'
            })
        } catch (error) {
            ExpressFunctions.controllerError(res, error)
        }
    }

    export async function createApiResponse(req: express.Request, res: express.Response) {
        try {
            await ApisModel.createApiResponse(req.body, req.headers.authorization!)

            return res.status(201).json({
                status: 201,
                message: 'Response successfully created'
            })
        } catch (error) {
            ExpressFunctions.controllerError(res, error)
        }
    }

    export async function createApiPayload(req: express.Request, res: express.Response) {
        try {
            await ApisModel.createApiPayload(req.body, req.headers.authorization!)

            return res.status(201).json({
                status: 201,
                message: 'Payload successfully created'
            })
        } catch (error) {
            ExpressFunctions.controllerError(res, error)
        }
    }
    
}

export default ApisCtrl
import express from 'express'

import controllerError from '@lib/controllerError'
import ApisModel from './apis.model'

namespace ApisCtrl {

    export async function getApis(req: express.Request, res: express.Response) {
        try {
            const model = await ApisModel.getApis({
                projectId: req.params.project_id
            }, req.headers.authorization as string)

            return res.status(200).json(model)
        } catch (error) {
            controllerError(res, error)
        }
    }

    export async function createApi(req: express.Request, res: express.Response) {
        try {
            await ApisModel.createApi(req.body, req.headers.authorization as string)

            return res.status(201).json({
                status: 201,
                message: 'Api successfully created'
            })
        } catch (error) {
            controllerError(res, error)
        }
    }

    export async function createApiResponse(req: express.Request, res: express.Response) {
        try {
            await ApisModel.createApiResponse(req.body, req.headers.authorization as string)

            return res.status(201).json({
                status: 201,
                message: 'Response successfully created'
            })
        } catch (error) {
            controllerError(res, error)
        }
    }
    
}

export default ApisCtrl
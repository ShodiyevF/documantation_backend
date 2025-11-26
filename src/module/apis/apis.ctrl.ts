import express from 'express'

import ExpressFunctions from '@lib/express_functions.lib'
import ApisInterface from '@interface/apis.inteface'
import ApisModel from './apis.model'

namespace ApisCtrl {

    export async function getApis(req: express.Request, res: express.Response) {
        try {
            const query: ApisInterface.IGetApisQuery = {
                limit: +req.query.limit!,
                page: +req.query.page!,
                module_id: req.query.module_id as string
            }
            
            const model = await ApisModel.getApis(query, req.headers.authorization!)

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

    export async function updateApi(req: express.Request, res: express.Response) {
        try {
            await ApisModel.updateApi(req.body, req.params.api_id, req.headers.authorization!)

            return res.status(200).json({
                status: 200,
                message: 'Api successfully updated'
            })
        } catch (error) {
            ExpressFunctions.controllerError(res, error)
        }
    }

    export async function deleteApi(req: express.Request, res: express.Response) {
        try {
            await ApisModel.deleteApi(req.params.api_id, req.headers.authorization!)

            return res.status(200).json({
                status: 200,
                message: 'Api successfully deleted'
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
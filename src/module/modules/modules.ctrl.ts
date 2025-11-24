import express from 'express'

import ModulesInterface from '@interface/modules.interface'
import ExpressFunctions from '@lib/express_functions.lib'
import ModulesModel from './modules.model'

namespace ModulesCtrl {

    export async function getModules(req: express.Request, res: express.Response) {
        try {
            const query: ModulesInterface.IGetModulesQuery = {
                limit: +req.query.limit!,
                page: +req.query.page!,
                project_id: req.query.project_id! as string
            }
            
            const model = await ModulesModel.getModules(query, req.headers.authorization!)

            return res.status(200).json(model)
        } catch (error) {
            ExpressFunctions.controllerError(res, error)
        }
    }

    export async function getModuleById(req: express.Request, res: express.Response) {
        try {
            const model = await ModulesModel.getModuleById(req.params.module_id, req.headers.authorization!)

            return res.status(200).json(model)
        } catch (error) {
            ExpressFunctions.controllerError(res, error)
        }
    }
    
}

export default ModulesCtrl
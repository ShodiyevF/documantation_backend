import express from 'express'

import ExpressFunctions from '@lib/express_functions.lib'
import GlobalInterface from '@interface/global.interface'
import UsersModel from './users.model'

namespace UsersCtrl {

    export async function getUsersAll(req: express.Request, res: express.Response) {
        try {
            const query: GlobalInterface.IGetAll = {
                term: req.query.term as string
            }
            
            const model = await UsersModel.getUsersAll(query)
            
            return res.status(200).json(model)
        } catch (error) {
            ExpressFunctions.controllerError(res, error)
        }
    }
    
}

export default UsersCtrl
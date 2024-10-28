import express from 'express'

import controllerError from '@lib/controllerError'
import AuthModel from './auth.model'

namespace AuthCtrl {

    export async function register(req: express.Request, res: express.Response) {
        try {
            await AuthModel.register(req.body)

            return res.status(201).json({
                status: 201,
                message: 'User successfully registered'
            })
        } catch (error) {
            controllerError(res, error)
        }
    }

    export async function login(req: express.Request, res: express.Response) {
        try {
            const model = await AuthModel.login(req.body)

            return res.status(201).json({
                status: 201,
                message: 'Successfully logged',
                token: model
            })
        } catch (error) {
            controllerError(res, error)
        }
    }
    
}

export default AuthCtrl
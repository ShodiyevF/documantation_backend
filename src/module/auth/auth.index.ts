import express from 'express'

import validationMiddleware from '@middleware/validator.middleware'
import AuthDto from '@dto/auth.dto'
import AuthCtrl from './auth.ctrl'

const app = express.Router()

app.post('/api/auth/register',
    validationMiddleware(AuthDto.register, 'body'),
    AuthCtrl.register
)

app.post('/api/auth/login',
    validationMiddleware(AuthDto.login, 'body'),
    AuthCtrl.login
)

export default app
import express from "express";

import authorizationMiddleware from "@middleware/authorization.middleware";
import validationMiddleware from "@middleware/validator.middleware";
import GlobalDto from "@dto/global.dto";
import UsersCtrl from "./users.ctrl";

const app = express.Router()

app.get(
    '/api/users/get/me',
    authorizationMiddleware,
    UsersCtrl.getMe
)

app.get(
    '/api/users/get/all',
    authorizationMiddleware,
    validationMiddleware(GlobalDto.getAllQuery, 'query'),
    UsersCtrl.getUsersAll
)

export default app
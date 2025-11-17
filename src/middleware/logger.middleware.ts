import express from "express";

import internalErrorCatcher from "@shared/logger/logger.internal";
import { logWriter } from "@logger/logger.request";
import Exception from "@lib/http_exception.lib";

namespace LoggerMiddleware {
    function writeLog(res: express.Response, req: express.Request, body: any) {
        logWriter(
            res.statusCode,
            req.hostname,
            req.method,
            req.url,
            req.headers['user-agent'],
            req.body,
            body
        )
    }
    
    export async function logger(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const originalSend = res.send;
            
            res.send = function (body): any {
                try {
                    const parsedBody = JSON.parse(body);
                    writeLog(res, req, parsedBody)
                } catch (error) {
                    const parsedBody = body
                    writeLog(res, req, parsedBody)
                }
            
                originalSend.call(this, body);
            };
    
            next();
        } catch (error) {
            internalErrorCatcher(error)
            return res.status(500).json({
                status: 500,
                message: `Syntax error`,
                error: Exception.Errors.INTERNAL_SERVER_ERROR,
            });
        }
    
    }
    
    export async function notFoundLogger(req: express.Request, res: express.Response, next: express.NextFunction){
        try {
            res.status(404)
    
            logWriter(
                res.statusCode,
                req.hostname,
                req.method,
                req.url,
                req.headers['user-agent'],
                req.body,
                `Cannot ${req.method} ${req.url}`
            )
    
            next()
        } catch (error) {
            next(error);
        }
    }
}

export default LoggerMiddleware;
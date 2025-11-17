import express from "express";

import Exception from "./http_exception.lib";
import EnvLib from "./env.lib";

namespace ExpressFunctions  {
    export function returnResponse(res: express.Response, status: number, message: string, error: Exception.Errors) {
        return res.status(status).json({
            status,
            message,
            error,
        });
    }
    
    function isSyntaxErrorWithStatus(error: any): error is SyntaxError & { status: number } {
        return error instanceof SyntaxError && 'status' in error && typeof error.status === 'number';
    }
    
    export function badJsonFormatHandler(app: express.Application) {
        app.use((err: SyntaxError, req: express.Request, res: express.Response, next: express.NextFunction) => {
            if (isSyntaxErrorWithStatus(err) && err.status === 400 && 'body' in err) {
                if (EnvLib.getVariable('MODE') === 'DEV') {
                    console.error('Bad JSON format:', err.message);
                }
                return res.status(400).json({ 
                    status: 400,
                    message: 'Invalid JSON format',
                    error: Exception.Errors.BAD_JSON_FORMAT
                });
            }
            next();
        });
    }
    
    export function controllerError(res: express.Response, error: any) {
        if (EnvLib.getVariable('MODE') == 'DEV') {
            console.log(error)
        }
        
        if (!error.status) {
            return ExpressFunctions.returnResponse(res, 500, `INTERNAL ERROR: ${error}`, Exception.Errors.INTERNAL_SERVER_ERROR)
        } else {
            return ExpressFunctions.returnResponse(res, error.status, error.message, error.error)
        }
    }
}

export default ExpressFunctions
import jwt from 'jsonwebtoken'

import internalErrorCatcher from '@shared/logger/logger.internal';

namespace JWT {

    export function requestJwtToken(payload: object) {
        try {
            const token = jwt.sign(payload, process.env.JWT_SECRET ? process.env.JWT_SECRET : 'test', {
                expiresIn: process.env.JWT_EXPIRATION ? +process.env.JWT_EXPIRATION : 0,
            });
            return token;
        } catch (error) {
            internalErrorCatcher(error);
        }
    }
    
    export function verifyJwtToken(token: string) {
        try {
            const verifed = jwt.verify(token, process.env.JWT_SECRET || 'test');
            if (typeof verifed != 'object' || !verifed.id) {
                return false
            }
            
            return verifed.id;
        } catch (error: any) {
            if (error.expiredAt) {
                return {
                    status: 402,
                };
            } else {
                return {
                    status: 402,
                }
            }
        }
    }
    
}

export default JWT
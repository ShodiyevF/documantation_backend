import jwt from 'jsonwebtoken'

import internalErrorCatcher from '@shared/logger/logger.internal';
import EnvLib from './env.lib';

namespace JwtLib {

    interface VerifiedToken<T> {
        result: 'VERIFIED';
        data: T;
    }
    
    interface UnverifiedToken {
        result: 'UNVERIFIED' | 'EXPIRED' | 'BAD_TOKEN';
    }
    
    export type IVerifyJwtToken<T> = VerifiedToken<T> | UnverifiedToken;

    const expiration = +EnvLib.getVariable('JWT_EXPIRATION')
    const secretCode = EnvLib.getVariable('JWT_SECRET')
    
    export function requestJwtToken(payload: object) {
        try {
            const token = jwt.sign(payload, secretCode, {
                expiresIn: expiration,
            });
            return token;
        } catch (error) {
            internalErrorCatcher(error);
        }
    }
    
    export function verifyJwtToken(token: string): IVerifyJwtToken<any> {
        try {
            const verifed = jwt.verify(token, secretCode);
            if (typeof verifed != 'object') {
                return {
                    result: 'UNVERIFIED',
                }
            }
            
            return {
                result: 'VERIFIED',
                data: verifed
            };
        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                return {
                    result: 'EXPIRED'
                }
            }
            
            return {
                result: 'BAD_TOKEN'
            }
        }
    }
    
}

export default JwtLib
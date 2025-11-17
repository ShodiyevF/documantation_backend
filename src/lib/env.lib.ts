import dotenv from "dotenv";
import fs from 'fs'

import type { EnvVariables } from "@customTypes/env_variables";

const envExample = dotenv.config({ path: '.env.example' });
const env = dotenv.config({ path: '.env' });

const envs: Record<string, string> = {};

namespace EnvLib {

    export function checkExists() {
        const checkEnvExample = fs.existsSync('.env.example')
        const checkEnv = fs.existsSync('.env')

        if (!checkEnvExample) {
            console.warn('=================================');
            console.warn(`=========== ENV ERROR ===========`);
            console.warn(`❗️  ENV EXAMPLE FILE NOT FOUND ❗️`);
            console.warn('=================================');

            return process.exit(1)
        }

        if (!checkEnv) {
            console.warn('=================================');
            console.warn(`=========== ENV ERROR ===========`);
            console.warn(`❗️     ENV FILE NOT FOUND      ❗️`);
            console.warn('=================================');

            return process.exit(1)
        }

        return 'CORRECT'
    }

    export function checkVariables() {
        const envExampleVariables = Object.keys(envExample.parsed!)
        const envVariables = Object.keys(envs!)

        const notExistVariables = envExampleVariables.filter(data => !envVariables.includes(data))
        if (notExistVariables.length) {
            console.warn('=================================');
            console.warn(`=========== ENV ERROR ===========`);
            console.warn(`❗️   ${notExistVariables.join(', ')} not exists on env file  ❗️`);
            console.warn('=================================');

            return process.exit(1)
        }

        const notExistInExampleVariables = envVariables.filter(data => !envExampleVariables.includes(data))
        if (notExistInExampleVariables.length) {
            console.warn('=================================');
            console.warn(`=========== ENV ERROR ===========`);
            console.warn(`❗️   ${notExistInExampleVariables.join(', ')} not exists on example env file plz remove it ❗️`);
            console.warn('=================================');

            return process.exit(1)
        }

        const checkVariablesValue = Object.entries(envs!).filter(([key, value]) => !value)
        if (checkVariablesValue.length) {
            console.warn('=================================');
            console.warn(`=========== ENV ERROR ===========`);
            console.warn(`❗️   ${checkVariablesValue.map(([key, value]) => key).join(', ')} . These keys do not have values ❗️`);
            console.warn('=================================');

            return process.exit(1)
        }

        return 'ALL_CORRECT'
    }

    export function syncVariables() {
        const envVariables = Object.keys(env.parsed!)
        
        for (const envVariable of envVariables) {
            if (process.env[envVariable] !== undefined) {
                envs[envVariable] = process.env[envVariable]!;
            } else {
                envs[envVariable] = env.parsed![envVariable];
            }
        }
    }

    export function getVariable(variableName: EnvVariables) {
        const envVariables = Object.entries(envs!).find(([key, name]) => key === variableName)
        
        return envVariables![1]
    }
    
}

EnvLib.syncVariables()

export default EnvLib
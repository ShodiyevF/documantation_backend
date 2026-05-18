import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import EnvLib from '@lib/env.lib'

const pool = new Pool({
    user: EnvLib.getVariable('DB_USER'),
    password: EnvLib.getVariable('DB_PASSWORD'),
    database: EnvLib.getVariable('DB_NAME'),
    host: EnvLib.getVariable('DB_HOST'),
    port: +EnvLib.getVariable('DB_PORT')
})

export const db = drizzle(pool)

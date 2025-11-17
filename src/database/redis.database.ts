import Redis from "ioredis";

const REDIS_PORT = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 0
const REDIS_DB = process.env.REDIS_DB ? parseInt(process.env.REDIS_DB) : 0

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: REDIS_PORT,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    db: REDIS_DB
})

export default redis
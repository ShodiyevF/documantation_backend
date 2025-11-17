import cors from "cors";

const allowlist: string = process.env.ORIGIN ?? eval(process.env.ORIGIN || '*');

const CORS_OPTIONS: cors.CorsOptions = {
    origin: allowlist,
    methods: ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE', 'PUT'],
    credentials: process.env.CREDENTIALS === 'true',
    preflightContinue: true,
    optionsSuccessStatus: 200,
};

export default CORS_OPTIONS
import dotnev from 'dotenv'
dotnev.config({ path: `.env` });

import expressFileupload from 'express-fileupload'
import express from 'express'
import cors from 'cors'

import LoggerMiddleware from '@middleware/logger.middleware';
import runConfigCronJobs from '@config/cronjobs.config';
import initDefaultFolders from '@config/defaultfiles';
import ExpressFunctions from '@lib/express.function';
import CORS_OPTIONS from '@config/cors';

export default function app(routes: []) {
    const app: express.Application = express();
    const port: string = process.env.PORT || '3000';

    function listener() {
        app.listen(port, () => {
            console.info('=================================');
            console.info(`======== ENV: production ========`);
            console.info(`🚀 App listening on the port ${port}`);
            console.info('=================================');
        });
    }

    function initMiddlewares() {
        app.use(LoggerMiddleware.logger);
        app.use(cors(CORS_OPTIONS));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(expressFileupload());        
    }

    function initBadJsonHandler() {
        ExpressFunctions.badJsonFormatHandler(app)
    }

    function notFoundLogs() {
        app.use(LoggerMiddleware.notFoundLogger);        
    }

    function initCronjobs() {
        runConfigCronJobs();
    }

    function defaultFiles() {
        initDefaultFolders();
    }

    function initRoutes(routes: []) {
        routes.forEach(route => {
            app.use(route);
        });
    }

    async function runner() {
        defaultFiles();
        initCronjobs();
        initMiddlewares();
        initBadJsonHandler();
        initRoutes(routes);
        notFoundLogs()
        listener();
    }

    runner();
}

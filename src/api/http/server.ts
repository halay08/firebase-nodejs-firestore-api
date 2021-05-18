import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { Application } from 'express';
import * as helmet from 'helmet';
import { inject, injectable } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';

import { apiVersion } from '@/api/http/config/constants';
import ValidationHandler from '@/api/http/middlewares/validation';
import { Logger } from '@/infra/logging/pino';
import Container from '@/src/container';
import TYPES from '@/src/types';
import AuthProvider from './providers/auth';

export interface IServer {
    start(): Application;
}

@injectable()
export class Server implements IServer {
    @inject(TYPES.Logger) private theLogger: Logger;

    start(): Application {
        const logger = this.theLogger.get();
        const server = new InversifyExpressServer(
            Container,
            null,
            {
                rootPath: `/${apiVersion}`
            },
            null,
            AuthProvider
        );

        server.setConfig((app) => {
            app.use(
                bodyParser.urlencoded({
                    extended: true
                })
            );
            app.use(bodyParser.json());
            app.use(helmet());
            app.use(cors({ origin: true }));

            app.on('error', (err) => {
                if (process.env.NODE_ENV !== 'test') {
                    logger.error(err);
                }
            });
        });

        server.setErrorConfig((app) => {
            app.use(ValidationHandler);
        });

        return server.build();
    }
}

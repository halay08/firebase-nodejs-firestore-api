// eslint-disable-next-line import/no-unassigned-import
import 'reflect-metadata';
// eslint-disable-next-line import/no-unassigned-import
import 'module-alias/register';
// eslint-disable-next-line import/no-unassigned-import
import './ioc.loader';

import { Container } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';
import { makeLoggerMiddleware } from 'inversify-logger-middleware';

import { IServer, Server } from './api/http/server';
import { FirestoreData } from './infra/database/firestore';
import { Logger } from './infra/logging/pino';
import TYPES from './types';
import FireAuth from '@/infra/auth/firebase/auth';

const container = new Container();
if (process.env.NODE_ENV === 'development' && process.env.ENABLE_LOGGER === 'true') {
    const logger = makeLoggerMiddleware();
    container.applyMiddleware(logger);
}

// Manually
container.bind(TYPES.Database).to(FirestoreData).inSingletonScope();

container.bind(TYPES.FireAuth).to(FireAuth).inSingletonScope();

container.bind(TYPES.Logger).to(Logger).inSingletonScope();

container.bind<IServer>(TYPES.Server).to(Server).inSingletonScope();

// Reflects all decorators provided by this package and packages them into
// a module to be loaded by the container
container.load(buildProviderModule());

export default container;

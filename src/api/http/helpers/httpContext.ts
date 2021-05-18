import { interfaces } from 'inversify-express-utils';
import * as express from 'express';

const httpContext = (req: express.Request): interfaces.HttpContext => {
    return Reflect.getMetadata('inversify-express-utils:httpcontext', req);
};

export { httpContext };

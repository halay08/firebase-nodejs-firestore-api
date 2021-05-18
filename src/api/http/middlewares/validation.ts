import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ValidationError } from 'express-validation';
import HTTPStatus from 'http-status-codes';

export default function (err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) {
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json(err);
    }

    return res.status(HTTPStatus.BAD_GATEWAY).json(err);
}

import { Response } from 'express';
import HttpStatus from 'http-status-codes';
import { inject } from 'inversify';
import {
    controller,
    httpDelete,
    httpGet,
    httpPost,
    httpPut,
    interfaces,
    requestBody,
    requestParam,
    response
} from 'inversify-express-utils';
import { User } from '@/domain';
import { UserService } from '@/src/app/services';
import TYPES from '@/src/types';
import { authorize } from '@/api/http/middlewares';
import { NewUserPayload, validateCreate, validateUpdate } from '@/api/http/requests/user';
import { UserRole, UserStatus } from '@/src/domain/types';
import { NotFoundError } from '@/src/app/errors';
import { validateUserExist } from '../helpers';
import { BaseController } from './base';

@controller(`/users`, authorize({ roles: [UserRole.ADMIN, UserRole.EDITOR] }))
export class UserController extends BaseController implements interfaces.Controller {
    @inject(TYPES.UserService) private userService: UserService;

    @httpGet('/')
    public async all(@response() res: Response) {
        try {
            const data = await this.userService.getAll();

            return res.status(HttpStatus.OK).json(this.response(data.map((u) => u.serialize())));
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(this.response(error));
        }
    }

    @httpGet('/:id')
    public async get(@requestParam('id') id: string, @response() res: Response) {
        try {
            const data = await this.userService.getById(id);
            if (!data) {
                throw new NotFoundError(`User/${id} not found`);
            }

            return res.status(HttpStatus.OK).json(this.response(data.serialize()));
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(this.response(error));
        }
    }

    @httpPost('/', validateCreate)
    public async create(@requestBody() req: NewUserPayload, @response() res: Response) {
        try {
            const { uid } = this.httpContext.user.details;
            const id = req.id || uid;
            const existed = await this.userService.getById(id);
            if (existed) {
                return res.status(HttpStatus.OK).json(this.response(existed.serialize()));
            }

            const role: UserRole = req.role ? (<any>UserRole)[req.role.toUpperCase()] : UserRole.CUSTOMER;
            const { name = '', email } = req;
            const entity = User.create({
                role,
                id,
                email,
                name,
                status: UserStatus.ACTIVE
            });

            const data = await this.userService.create(entity);
            await this.userService.setRole(id, role);

            return res.status(HttpStatus.CREATED).json(this.response(data.serialize()));
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(this.response(error));
        }
    }

    @httpPut('/:id', validateUpdate)
    public async update(
        @requestParam('id') id: string,
        @requestBody() payload: Partial<User>,
        @response() res: Response
    ) {
        try {
            const { uid } = this.httpContext.user.details;
            if (id !== uid) {
                throw Error('Permission denied');
            }

            await validateUserExist(id, payload);

            if (payload.role) {
                const role: UserRole = (<any>UserRole)[payload.role.toUpperCase()];
                await this.userService.setRole(id, role);
            }

            const data = await this.userService.updateFields(id, payload);
            return res.status(HttpStatus.OK).json(this.response(data.serialize()));
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(this.response(error));
        }
    }

    @httpDelete('/:id')
    public async delete(@requestParam('id') id: string, @response() res: Response) {
        try {
            const { uid } = this.httpContext.user.details;
            if (id !== uid) {
                throw Error('Permission denied');
            }

            const data = await this.userService.delete(id);

            return res.status(HttpStatus.OK).json(this.response(data));
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(this.response(error));
        }
    }
}

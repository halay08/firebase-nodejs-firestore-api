import { BaseHttpController, interfaces } from 'inversify-express-utils';

export class BaseController extends BaseHttpController implements interfaces.Controller {
    public response(data: Array<Object> | Object = [], message: string = '', meta: Object = {}) {
        if (data instanceof Error) {
            return {
                status: false,
                message: message || data.message,
                data: {},
                meta: meta || {}
            };
        }
        return {
            status: true,
            message: message || 'Success',
            data: data || [],
            meta: meta || {}
        };
    }
}

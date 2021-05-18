import { ErrorCode } from '@/app/errors/codes';

export class NotFoundError extends Error {
    private _code: string;

    constructor(message: string) {
        super(message);
        this._code = ErrorCode.NOT_FOUND;
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    get code(): string {
        return this._code;
    }
}

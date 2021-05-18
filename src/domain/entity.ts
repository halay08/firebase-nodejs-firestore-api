import { IEntity } from './types';

const isEntity = (v: any): v is Entity<any> => {
    return v instanceof Entity;
};

export abstract class Entity<T extends IEntity> {
    protected readonly _id: string;
    protected _props: T;

    /**
     * Creates an instance of entity.
     * @param props
     */
    constructor(props: T) {
        this._props = props;
    }

    /**
     * Props getter
     */
    get props(): T {
        return this._props;
    }

    /**
     * Serializes entity
     * @returns serialize
     */
    serialize(): T {
        return {
            ...this._props
        };
    }

    /**
     * Equals entity
     * @param [object]
     * @returns boolean
     */
    equals(object?: Entity<T>): boolean {
        if (object === null || object === undefined) {
            return false;
        }

        if (this === object) {
            return true;
        }

        if (!isEntity(object)) {
            return false;
        }

        return this._id === object._id;
    }
}

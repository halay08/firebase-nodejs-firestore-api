import { Entity } from './entity';
import { injectable } from 'inversify';
import { IUserEntity, UserRole, UserStatus } from './types';

// Collection: users
@injectable()
export class User extends Entity<IUserEntity> {
    constructor(props: IUserEntity) {
        super(props);
    }

    /**
     * Creates user entity
     * @param props User properties
     * @returns User
     */
    public static create(props: IUserEntity): User {
        const instance = new User(props);
        return instance;
    }

    get id(): string {
        return this._props.id || '';
    }

    get role(): UserRole | undefined {
        return this.props.role;
    }

    /**
     * Email  of user entity
     */
    get email(): string {
        return this.props.email || '';
    }

    /**
     * Phone number of user entity
     */
    get phoneNumber(): string {
        return this.props.phoneNumber || '';
    }

    /**
     * Name  of user entity
     */
    get name(): string {
        return this.props.name || '';
    }

    /**
     * This will display on URL. Thus, it should be unique
     */
    get username(): string {
        return this.props.username || '';
    }

    /**
     * Gets avatar
     */
    get avatar(): string {
        return this.props.avatar || '';
    }

    /**
     * Gets birthday
     */
    get birthday(): Date {
        return this.props.birthday || (null as any);
    }

    /**
     * Gets biography
     */
    get biography(): string {
        return this.props.biography || '';
    }

    /**
     * Gets address
     */
    get address(): string {
        return this.props.address || '';
    }

    /**
     * Gets timezone
     */
    get timezone(): string {
        return this.props.timezone || 'UTC';
    }

    /**
     * Gets country
     */
    get country(): string {
        return this.props.country || '';
    }

    /**
     * Gets language
     */
    get language(): string {
        return this.props.language || 'EN';
    }

    /**
     * Gets status
     */
    get status(): UserStatus {
        return this.props.status;
    }
}

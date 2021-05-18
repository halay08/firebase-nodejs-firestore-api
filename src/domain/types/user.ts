import { IEntity, ITimestamp } from '.';

enum UserStatus {
    PENDING = 'pending',
    ACTIVE = 'active',
    REJECTED = 'rejected',
    BANNED = 'banned'
}

enum UserRole {
    ADMIN = 'admin',
    CUSTOMER = 'customer',
    EDITOR = 'editor'
}

type IUserEntity = IEntity &
    ITimestamp & {
        role?: UserRole;

        /**
         * Email  of user entity
         */
        email?: string;

        /**
         * Phone number of user entity
         */
        phoneNumber?: string;

        /**
         * Name  of user entity
         */
        name?: string;

        /**
         * This will display on URL. Thus, it should be unique
         */
        username?: string;

        avatar?: string;

        birthday?: Date;

        biography?: string;

        address?: string;

        timezone?: string;

        country?: string;

        language?: string;

        status: UserStatus;
    };

export { UserStatus, UserRole, IUserEntity };

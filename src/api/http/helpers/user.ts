import { User } from '@/src/domain';
import { UserService } from '@/src/app/services';
import Container from '@/src/container';
import TYPES from '@/src/types';

const validateUserExist = async (id: string, payload: Partial<User>): Promise<boolean> => {
    const userService = Container.get<UserService>(TYPES.UserService);

    // Check user name exist
    if (payload.username) {
        const user = await userService.findBy('username', payload.username);
        if (user.length > 0 && user[0].id !== id) {
            throw Error('Username is already used by another user');
        }
    }

    // Check email exist
    if (payload.email) {
        const user = await userService.findBy('email', payload.email);
        if (user.length > 0 && user[0].id !== id) {
            throw Error('Email is already used by another user');
        }
    }

    return true;
};

export { validateUserExist };

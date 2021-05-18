import TYPES from '@/src/types';
import Container from '@/src/container';
import * as functions from 'firebase-functions';
import { region, runtimeOptions } from './configs/runtime';
import { UserSeeding } from '@/infra/database/migration/seeding';
import { UserService } from '@/src/app/services';
import { UserRole, UserStatus } from '@/src/domain/types';
import { User } from '@/domain';

const userSeeding = functions
    .runWith(runtimeOptions)
    .region(region)
    .https.onCall(async (data, context) => {
        const seeding = Container.get<UserSeeding>(TYPES.UserSeeding);
        await seeding.run();
    });

const onCreateUser = functions
    .runWith(runtimeOptions)
    .region(region)
    .auth.user()
    .onCreate(async (u) => {
        const service = Container.get<UserService>(TYPES.UserService);

        const role: UserRole = UserRole.CUSTOMER;
        const { uid: id, displayName: name = '', email = '', phoneNumber = '', photoURL: avatar = '' } = u;

        // Check user exists
        const existUser = await service.getById(u.uid);
        if (existUser) {
            throw Error(`User with email ${email} already existed`);
        }

        const entity = User.create({
            role,
            id,
            email,
            name,
            avatar,
            phoneNumber,
            status: UserStatus.ACTIVE
        });

        // Create new user
        const user = await service.create(entity);
        // Set custom claim for auth user
        await service.setRole(user.id, role);
    });

export { userSeeding, onCreateUser };

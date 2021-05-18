import { inject } from 'inversify';
import TYPES from '@/src/types';
import { provide } from 'inversify-binding-decorators';
import { UserStatus, UserRole, IUserEntity } from '@/domain/types';
import { ISeeding } from './interfaces/seeding';
import { User } from '@/domain';
import { AuthService, UserService } from '@/src/app/services';
import { fireauth } from '@/infra/auth/firebase/types';
import { BaseSeeding } from '.';

@provide(TYPES.UserSeeding)
export class UserSeeding extends BaseSeeding implements ISeeding {
    @inject(TYPES.AuthService)
    private readonly authService: AuthService;

    @inject(TYPES.UserService)
    private readonly userService: UserService;

    getUserData(): IUserEntity[] {
        return [
            {
                role: UserRole.CUSTOMER,
                email: 'halay08@gmail.com',
                status: UserStatus.ACTIVE,
                name: 'Mr Khiem',
                phoneNumber: '097514761',
                username: 'halay08',
                avatar:
                    'https://avatars.githubusercontent.com/u/50725397?s=400&u=0ae94fc599781b18ba3fea77fce0f8be1e94d367&v=4',
                biography:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                timezone: 'Asia/Ho_Chi_Minh',
                country: 'Vietnam',
                language: 'VN'
            }
        ];
    }

    async run() {
        const users = this.getUserData();

        for (const user of users) {
            const { email = '' } = user;

            // Check exist user in Firestore
            const existedUser = await this.userService.findBy('email', email);
            if (existedUser.length > 0) {
                console.log(`User ${email} already existed in the database`);
                continue;
            }

            // Check exist user in Authentication
            let authUser;
            try {
                authUser = await this.authService.getUserByEmail(email);
            } catch (err) {
                console.log(`Warning: ${err.message}`);
            }

            if (!authUser) {
                const props: fireauth.ICreateRequest = {
                    email,
                    displayName: user.name,
                    emailVerified: true,
                    photoURL: user.avatar,
                    password: 'abcd1234'
                };

                // Create authentication user
                authUser = await this.authService.createUser(props);
                if (!authUser?.uid) {
                    throw new Error(`Couldn't create authentication user with email ${email}`);
                }
            }

            user.id = authUser.uid;

            // Set/update custom claim
            await this.authService.setCustomUserClaims(`${user.id}`, { role: user.role?.toString() });

            // Create Firestore user
            const entity: User = User.create(user);
            const newUser = await this.userService.create(entity);
            const newEntity = newUser.serialize();
            console.log(`New user was created ${newEntity.id}`);
        }

        console.log('DONE!');
    }
}

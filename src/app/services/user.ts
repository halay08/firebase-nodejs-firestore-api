import { provide } from 'inversify-binding-decorators';
import { User } from '@/domain';
import { IRepository, IUserRepository } from '@/src/infra/database/repositories';
import TYPES from '@/src/types';
import { BaseService } from './base';
import Container from '@/src/container';
import { NotFoundError } from '@/app/errors';
import { UserRole } from '@/src/domain/types';
import { AuthService } from '@/src/app/services';
import { inject } from 'inversify';

@provide(TYPES.UserService)
export class UserService extends BaseService<User> {
    @inject(TYPES.AuthService) private authService: AuthService;
    /**
     * Create user repository instance
     * @returns IRepository<T>
     */
    protected getBaseRepositoryInstance(): IRepository<User> {
        return Container.get<IUserRepository>(TYPES.UserRepository);
    }

    /**
     * Updates fields document
     * @param id
     * @param object fields of document
     * @returns update
     */
    async updateFields(id: string, { ...args }): Promise<User> {
        const user = await this.getById(id);
        if (!user) {
            throw new NotFoundError(`User/${id} not found`);
        }

        const userEntity = user.serialize();
        delete userEntity.id;

        const userData = User.create({ ...userEntity, ...args });

        return this.update(id, userData.serialize());
    }

    /**
     * Sets role
     * @param id
     * @param [role]
     * @returns role
     */
    async setRole(id: string, role?: UserRole): Promise<void> {
        if (!role) return;

        await this.authService.setCustomUserClaims(id, { role });
    }
}

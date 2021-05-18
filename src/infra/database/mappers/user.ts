import { User } from '@/domain';

/**
 * User mapper
 */
export class UserMapper {
    static toDomain(raw: any): User {
        return User.create({
            id: raw.id,

            role: raw.role,

            email: raw.email,

            name: raw.name,

            username: raw.username,

            avatar: raw.avatar,

            phoneNumber: raw.phoneNumber,

            birthday: raw.birthday,

            biography: raw.biography,

            address: raw.address,

            timezone: raw.timezone,

            country: raw.country,

            language: raw.language,

            status: raw.status,

            createdAt: raw.createdAt,

            updatedAt: raw.updatedAt,

            deletedAt: raw.deletedAt
        });
    }
}

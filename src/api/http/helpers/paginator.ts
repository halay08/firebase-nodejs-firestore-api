import { IPaginationResponse } from '../../types/pagination';
import { IEntity } from '@/domain/types';

export const paginate = <T extends IEntity>(items: T[], filter?: object, sort?: object): IPaginationResponse<T> => {
    const totalItemOfPage = items.length;
    return {
        pagination: {
            lastRef: items[totalItemOfPage - 1]?.id || '',
            totalItemOfPage
        },
        filter,
        sort,
        items
    };
};

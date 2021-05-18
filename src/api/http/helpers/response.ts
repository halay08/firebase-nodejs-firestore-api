import { IEntity } from '@/domain/types';
import { base64Encode } from '@/src/app/types';

const getNextPageToken = <T extends IEntity>(data: Array<T>): string => {
    const id = data.length > 0 ? [...data].pop()?.id : '';

    if (id) {
        return base64Encode(id);
    }

    return '';
};

export { getNextPageToken };

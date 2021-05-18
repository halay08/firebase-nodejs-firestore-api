// eslint-disable-next-line import/no-unassigned-import
// import './connection';

import { injectable } from 'inversify';
import FirestoreCollection from './collection';
import { User } from '@/domain';
import * as types from './types';
import { COLLECTIONS } from '../config/collection';

@injectable()
class FirestoreData {
    public static users: FirestoreCollection<User> = new FirestoreCollection(COLLECTIONS.User);
}

export { FirestoreCollection, FirestoreData, types };

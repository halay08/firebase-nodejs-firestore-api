import { IOperatorQuery } from '@/infra/database/types';

type IFirestoreQuery<T> = IOperatorQuery<T, FirebaseFirestore.WhereFilterOp>;

export { IFirestoreQuery };

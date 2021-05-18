import { IFirestoreQuery } from './firestore/types';

// Firebase types
type IDocumentReference = FirebaseFirestore.DocumentReference;

type IFirestoreTimestamp = FirebaseFirestore.Timestamp;

type IDocumentData = FirebaseFirestore.DocumentData;

type IDocumentSnapshot<T> = FirebaseFirestore.DocumentSnapshot<T>;

type ICollectionReference<T> = FirebaseFirestore.CollectionReference<T>;

type IDocumentQuery<T> = IFirestoreQuery<T>;

type IWriteResult = FirebaseFirestore.WriteResult;

type IOrderBy<T> = {
    field: keyof T | string;

    order: 'desc' | 'asc';
};

type IOperatorQuery<T, K> = {
    [K in keyof T]?: any;
} & {
    operator?: K;
};

type IQuery<T> = IOperatorQuery<T, any>;

type IQueryOption<T> = {
    withTrashed: boolean;

    limit: number;

    startAt?: IDocumentSnapshot<IDocumentData>;

    startAfter?: IDocumentSnapshot<IDocumentData>;

    endAt?: IDocumentSnapshot<IDocumentData>;

    endBefore?: IDocumentSnapshot<IDocumentData>;

    orderBy: IOrderBy<T>[];
};

export {
    IQuery,
    IOrderBy,
    IWriteResult,
    IDocumentData,
    IQueryOption,
    IDocumentQuery,
    IOperatorQuery,
    IDocumentSnapshot,
    IDocumentReference,
    ICollectionReference,
    IFirestoreTimestamp
};

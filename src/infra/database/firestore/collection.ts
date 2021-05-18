import * as time from '@/app/helpers';
import { admin } from '@/src/firebase.config';
import {
    IDocumentReference,
    ICollectionReference,
    IDocumentData,
    IDocumentSnapshot,
    IQueryOption,
    IWriteResult
} from '@/infra/database/types';
import { IFirestoreQuery } from '@/src/infra/database/firestore/types';
import { IEntity } from '@/src/domain/types';

/**
 * Firestore collection
 * @template T
 */
export default class FirestoreCollection<T extends IEntity> {
    #collectionName: string = '';

    #softDelete: boolean = true;

    /**
     * Collection  of firestore repository
     */
    protected _collection: ICollectionReference<IDocumentData>;

    /**
     * Creates an instance of firestore repository.
     * @param collectionName
     */
    constructor(collectionName: string) {
        this._collection = admin.firestore().collection(collectionName);
        this.#collectionName = collectionName;
    }

    get collectionName(): string {
        return this.#collectionName;
    }

    /**
     * Uses soft delete for collection
     */
    useSoftDelete() {
        this.#softDelete = true;
    }

    /**
     * Uses hard delete for collection
     */
    useHardDelete() {
        this.#softDelete = false;
    }

    /**
     * Determines whether document reference is
     * @param doc
     * @returns document reference
     */
    private _isDocumentReference(doc: any): doc is IDocumentReference {
        return (<IDocumentReference>doc)?.path !== undefined;
    }

    /**
     * Maps doc field: doc entity fields, timestamp and reference id
     * @param doc Document snapshot
     * @param [data] Document entity fields
     * @returns
     */
    private _mapDocField(doc: IDocumentSnapshot<IDocumentData>, data: object = {}) {
        return doc.exists
            ? {
                  ...Object.assign(doc.data(), data),
                  id: doc.ref.id,
                  createdAt: doc.createTime,
                  updatedAt: doc.updateTime
              }
            : (null as any);
    }

    /**
     * Map Firestore document reference and data to entity T
     * @param doc Document snapshot
     * @param recursive Start number of recurring
     * @returns T
     */
    private async _mapDocReference(doc: IDocumentSnapshot<IDocumentData>, recursive: number = 0): Promise<T> {
        const data = doc.data() || {};

        for (const key in data) {
            if (this._isDocumentReference(data[key])) {
                const ref = <IDocumentReference>data[key];
                const refDoc = await ref.get();
                // Deep 3 levels.
                if (recursive < 3) {
                    data[key] = await this._mapDocReference(refDoc, recursive + 1);
                } else {
                    data[key] = ref;
                }
            }

            if (Array.isArray(data[key]) && this._isDocumentReference(data[key][0])) {
                const arr = data[key];
                data[key] = await Promise.all(
                    arr.map(async (d: IDocumentReference) => {
                        const refDoc = await d.get();
                        return this._mapDocReference(refDoc);
                    })
                );
            }
        }

        return this._mapDocField(doc, data);
    }

    getQueryCollection(): FirebaseFirestore.Query<IDocumentData> {
        return admin.firestore().collection(this.#collectionName);
    }

    /**
     * Create Document Reference unique id
     * @returns string
     */
    genId(): string {
        const ref: IDocumentReference = admin
            .firestore()
            .collection(this.#collectionName)
            .doc();

        return ref.id;
    }

    /**
     * Get reference document by path
     * @param path
     * @returns IDocumentReference
     */
    getDocumentRef(path: string): IDocumentReference {
        return admin.firestore().doc(path);
    }

    /**
     * Gets blank document
     * @param collection Collection name
     * @returns IDocumentReference
     */
    getBlankDocument(collection: string): IDocumentReference {
        return admin.firestore().collection(collection).doc();
    }

    /**
     * Get all
     * @returns all
     */
    async getAll(refs: Array<IDocumentReference> = [], recursive: number = 0): Promise<T[]> {
        const documentData = await admin.firestore().getAll(...refs);

        return Promise.all(documentData.map((doc) => this._mapDocReference(doc, recursive)));
    }

    /**
     * Finds all
     * @returns all
     */
    async findAll(options: Partial<IQueryOption<T>> = {}): Promise<T[]> {
        return this.query([], options);
    }

    /**
     * Finds by id
     * @param id
     * @param recursive Start number of recurring
     * @returns by id
     */
    async findById(id: string, recursive: number = 0): Promise<T> {
        const doc = await this._collection.doc(id).get();

        return this._mapDocReference(doc, recursive);
    }

    /**
     * Creates firestore document.
     * @param id Id of document
     * @param data Document data
     * @returns create
     */
    async set(id: string, data: Partial<T>): Promise<IWriteResult> {
        const dataModel: any = {
            ...data
        };

        if (this.#softDelete) {
            dataModel['deletedAt'] = null;
        }

        // Not allow to write field `id` to database
        delete dataModel.id;

        return await this._collection.doc(id).set(dataModel);
    }

    /**
     * Creates firestore repository
     * @param data
     * @param recursive Start number of recurring
     * @returns create
     */
    async create(data: Partial<T>, recursive: number = 0): Promise<T> {
        // Add createdAt value
        const dataModel: any = {
            ...data
        };

        if (this.#softDelete) {
            dataModel['deletedAt'] = null;
        }

        // Not allow to write field `id` to database
        delete dataModel.id;

        const doc = await this._collection.add(dataModel);

        return this._mapDocReference(await doc.get(), recursive);
    }

    /**
     * Updates firestore repository
     * @param data
     * @returns update
     */
    async update(id: string, data: Partial<T>): Promise<IWriteResult> {
        // Not allow to write field `id` to database
        delete data.id;
        delete (data as any).createdAt;
        delete (data as any).updatedAt;
        delete (data as any).deletedAt;

        return await this._collection.doc(id).update(data);
    }

    /**
     * Deletes firestore repository
     * @param id Document ref id
     * @returns delete
     */
    async delete(id: string): Promise<IWriteResult> {
        let result: IWriteResult;

        if (this.#softDelete) {
            // Add deleteAt value
            const dataModel: object = {
                deletedAt: time.getCurrentUTCDate()
            };

            result = await this._collection.doc(id).update(dataModel);
        } else {
            result = await this._collection.doc(id).delete();
        }

        return result;
    }

    /**
     * Query firestore repository
     * @template T
     * @param queries
     * @param options
     * @param recursive Start number of recurring
     * @returns query
     */
    async query(
        queries: IFirestoreQuery<T>[] = [],
        options: Partial<IQueryOption<T>> = {},
        recursive: number = 0
    ): Promise<T[]> {
        let query = this.getQueryCollection();

        // Not include trashed documents
        if (!options.withTrashed && this.#softDelete) {
            query = query.where('deletedAt', '==', null);
        }

        if (queries.length > 0) {
            queries.forEach(async (q) => {
                const field = Object.keys(q).filter((k) => k !== 'operator')[0];

                if (!field) {
                    throw new Error('Query field is invalid');
                }

                if (field === 'id') {
                    query = query.where(
                        admin.firestore.FieldPath.documentId(),
                        q.operator || '==',
                        q[field as keyof T]
                    );
                } else {
                    query = query.where(field, q.operator || '==', q[field as keyof T]);
                }
            });
        }

        if (options.orderBy && options.orderBy.length > 0) {
            options.orderBy.reduce((acc, cur) => {
                query = acc.orderBy(cur.field as any, cur.order);
                return query;
            }, query);
        }

        if (options.startAt) {
            query = query.startAt(options.startAt);
        } else if (options.startAfter) {
            query = query.startAfter(options.startAfter);
        }

        if (options.endAt) {
            query = query.endAt(options.endAt);
        } else if (options.endBefore) {
            query = query.endBefore(options.endBefore);
        }

        if (options.limit) {
            query = query.limit(options.limit);
        }

        const documentData = await query.get();

        return Promise.all(documentData.docs.map((doc) => this._mapDocReference(doc, recursive)));
    }

    /**
     * Extracts reference to document entity
     * @param ref Reference to a collection
     * @returns T
     */
    async extractReference(ref: IDocumentReference): Promise<T> {
        if (this._isDocumentReference(ref)) {
            const doc = await ref.get();
            return this._mapDocReference(doc);
        }
        return null as any;
    }
}

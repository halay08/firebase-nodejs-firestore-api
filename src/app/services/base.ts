import { injectable } from 'inversify';
import { IRepository } from '@/src/infra/database/repositories';
import { IDocumentReference, IQuery, IQueryOption } from '@/src/infra/database/types';
import { NotFoundError } from '../errors';

@injectable()
export abstract class BaseService<T> {
    protected baseRepository: IRepository<T>;

    /**
     * Creates an instance of base service.
     */
    constructor() {
        this.baseRepository = this.getBaseRepositoryInstance();
    }

    /**
     * Create base repository instance
     * @returns IRepository<T>
     */
    protected abstract getBaseRepositoryInstance(): IRepository<T>;

    /**
     * Get reference document by path
     * @param id ID of document
     * @param path Path of reference document, ex: users/{id}/{path}
     * @returns IDocumentReference
     */
    getDocumentRef(id: string, path: string = ''): IDocumentReference {
        return this.baseRepository.getDocumentRef(id, path);
    }

    /**
     * Gets blank document
     * @returns IDocumentReference
     */
    getBlankDocument(): IDocumentReference {
        return this.baseRepository.getBlankDocument();
    }

    /**
     * Create Document Reference unique id
     * @returns string
     */
    genId(): string {
        return this.baseRepository.genId();
    }

    /**
     * Gets all by IDocumentReference
     *
     * @param refs The array of IDocumentReference
     * @returns all
     */
    async getAllByIds(refs: IDocumentReference[]): Promise<T[]> {
        return this.baseRepository.getAll(refs);
    }

    /**
     * Gets all
     * @returns all
     */
    async getAll(options?: Partial<IQueryOption<T>>): Promise<T[]> {
        return this.baseRepository.findAll(options);
    }

    /**
     * Querys base service
     * @param [queries]
     * @param [options]
     * @returns query
     */
    async query(queries: IQuery<T>[] = [], options: Partial<IQueryOption<T>> = {}): Promise<T[]> {
        return this.baseRepository.query(queries, options);
    }

    /**
     * Find record by field and value.
     *
     * @param field The query field
     * @param value The query value
     */
    async findBy(field: string, value: any, operator?: any): Promise<T[]> {
        return this.baseRepository.findBy(field, value, operator);
    }

    /**
     * Get by id.
     *
     * @param id The document id
     * @returns `document` object
     */
    async getById(id: string): Promise<T> {
        try {
            const document = await this.baseRepository.findById(id);
            return document;
        } catch (error) {
            if (error instanceof NotFoundError) {
                return null as any;
            }
            throw error;
        }
    }

    /**
     * Creates document service
     * @param document
     * @returns create
     */
    async create(document: T): Promise<T> {
        return this.baseRepository.create(document);
    }

    /**
     * Updates document service
     * @param id ID of document
     * @param document Partial<T>
     * @returns T
     */
    async update(id: string, document: Partial<T>): Promise<T> {
        return this.baseRepository.update(id, document);
    }

    /**
     * Deletes document service
     * @param id
     * @returns delete
     */
    async delete(id: string): Promise<number> {
        return this.baseRepository.delete(id);
    }

    /**
     * Extracts reference to document entity
     * @param ref Reference to a collection
     * @returns T
     */
    async extractReference(ref: IDocumentReference): Promise<T> {
        return this.baseRepository.extractReference(ref);
    }
}

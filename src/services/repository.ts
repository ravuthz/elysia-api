import { NotFoundError } from 'elysia';
import db from './database';
import { Prisma } from '@prisma/client';
import { ModelKey } from '@prisma/client/runtime/library';

type RecordAny = Record<string, any> | any;

class CrudRepository<CreateDto = RecordAny, UpdateDto = RecordAny> {

    private model: any;

    constructor(private key: string) {
        this.model = (db as RecordAny)[key];
    }

    findOne(where: RecordAny) {
        return this.model.findUnique({ where });
    }

    findAll(options: RecordAny = {}) {
        const { filter, orderBy, ...query } = options;

        if (!orderBy) {
            query.orderBy = { createdAt: 'desc' }
        }

        return this.model.findMany(query);
    }

    async paginate(options: RecordAny = {}) {
        const { page: queryPage, size: querySize, select, ...query } = options;

        const size = (+querySize || 10);
        const page = (+queryPage || 1);
        const total = await this.model.count(query);

        query.take = size;
        query.skip = (page - 1) * size;
        const data = await this.model.findMany({ ...query, select });

        return { data, meta: { page, size, total } };
    }

    findFirst(query: RecordAny = {}) {
        return this.model.findFirst(query);
    }

    async findById(id: number) {
        const item = await this.findOne({ id });
        if (!item) {
            throw new NotFoundError(`${this.key} not found.`);
        }
        return item;
    }

    async create(data: CreateDto) {
        return await this.model.create({ data });
    }

    async update(id: number, data: UpdateDto) {
        try {
            return await this.model.update({
                where: { id },
                data,
            });
        } catch (e: any) {
            if (e.code == 'P2025') {
                throw new NotFoundError(`${this.key} not found.`);
            }
            throw e;
        }
    }

    async destroy(id: number) {
        try {
            await this.model.delete({
                where: { id },
            });
            return {};
        } catch (e: any) {
            if (e.code == 'P2025') {
                throw new NotFoundError(`${this.key} not found.`);
            }
            throw e;
        }
    }
}

export default CrudRepository;

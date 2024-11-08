import { NotFoundError } from 'elysia';
import { Prisma } from '@prisma/client';

import db from './database';

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
        let select = options.select || {};
        const { page: queryPage, size: querySize, selectOnly, ...query } = options;

        if (Array.isArray(selectOnly) && selectOnly.length > 0) {
            const mapSelect: Prisma.UserSelect = selectOnly
                .reduce((acc, key) => {
                    acc[key] = true;
                    return acc;
                }, {} as Record<string, boolean>)

            select = { ...select, ...mapSelect };
        }

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

    async findById(id: string) {
        const item = await this.findOne({ id: Number(id) });
        if (!item) {
            throw new NotFoundError(`${this.key} not found.`);
        }
        return item;
    }

    async create(data: CreateDto) {
        return await this.model.create({ data });
    }

    async update(id: string, data: UpdateDto) {
        return await this.model.update({
            where: { id },
            data,
        });
    }

    async destroy(id: string) {
        return await this.model.delete({
            where: { id },
        });
    }
}

export default CrudRepository;

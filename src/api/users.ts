import Elysia, { t } from "elysia";

import Repository from "../services/repository";
import { Prisma } from "@prisma/client";

const TypeUser = t.Object({
    id: t.Optional(t.Number()),
    firstName: t.String(),
    lastName: t.String(),
    email: t.String(),
    password: t.Optional(t.String()),
    createdAt: t.Optional(t.Date()),
    updatedAt: t.Optional(t.Date()),
});

const body = t.Omit(TypeUser, ['password', 'id', 'createdAt', 'updatedAt']);

const query = t.Object({
    page: t.Optional(t.Number({ minimum: 1, default: 1 })),
    size: t.Optional(t.Number({ minimum: 1, default: 10 })),
});

const params = t.Object({
    id: t.Number(),
});

const responseList = t.Object({
    data: t.Array(TypeUser),
    meta: t.Object({
        page: t.Number(),
        size: t.Number(),
        total: t.Number(),
    }),
})

const response = t.Object({
    data: TypeUser,
})

const service = new Repository('User');

const users = new Elysia({ name: 'users' })
    .get("/", async ({ query }) => {
        const select: Prisma.UserSelect = ['id', 'firstName', 'lastName', 'email', 'createdAt', 'updatedAt']
            .reduce((acc, key) => {
                acc[key] = true;
                return acc;
            }, {} as Record<string, boolean>)

        return await service.paginate({ ...query, select });
    }, { query, response: responseList })
    .get("/:id", async ({ params }) => {
        const data = await service.findById(params.id);
        return { data };
    }, { params, response })
    .post("/", async ({ body }) => {
        const data = await service.create(body);
        return { data };
    }, { body })
    .patch("/:id", async ({ params, body }) => {
        const data = await service.update(params.id, body);
        return { data };
    }, { params, body, response })
    .delete("/:id", async ({ params }) => {
        const data = await service.destroy(params.id);
        return { data };
    }, { params, response });

export default users;
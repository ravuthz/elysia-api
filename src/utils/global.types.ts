import Elysia, { t } from "elysia";

const body = t.Any();

const query = t.Object({
    page: t.Optional(t.Number({ minimum: 1, default: 1 })),
    size: t.Optional(t.Number({ minimum: 1, default: 10 })),
    sorter: t.Optional(t.Object({})),
    filter: t.Optional(t.Object({})),
    select: t.Optional(t.Array(t.String())),
});

const params = t.Object({
    id: t.Number(),
});

const response = t.Object({
    data: t.Any(),
    meta: t.Optional(
        t.Object({
            page: t.Number(),
            size: t.Number(),
            total: t.Number(),
        })
    ),
})

export const globalTypes = new Elysia({ name: 'Guard.Type' })
    .guard({
        body,
        query,
        params,
        response,
    });

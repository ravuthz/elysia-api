import { Handler, t } from "elysia";

const Model = t.Object({
    id: t.Optional(t.Number()),
    createdAt: t.Optional(t.Date()),
    updatedAt: t.Optional(t.Date()),
});

const Body = t.Partial(Model);

const Query = t.Object({
    page: t.Optional(t.Number({ minimum: 1, default: 1 })),
    size: t.Optional(t.Number({ minimum: 1, default: 10 })),
    sorter: t.Optional(t.Object({})),
    filter: t.Optional(t.Object({})),
    select: t.Optional(t.Array(t.String())),
});

const Params = t.Object({
    id: t.Number(),
});

type BodyType = typeof Body;

type QueryType = typeof Query;

type ParamsType = typeof Params;

type ContextType = Handler & {
    body: BodyType;
    query: QueryType;
    params: ParamsType;
}


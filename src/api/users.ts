import Elysia, { t } from "elysia";

import Repository from "@/services/repository";
import { globalTypes } from "@/utils/global.types";

const UserType = t.Object({
    id: t.Optional(t.Number()),
    firstName: t.String(),
    lastName: t.String(),
    email: t.String(),
    password: t.Optional(t.String()),
    createdAt: t.Optional(t.Date()),
    updatedAt: t.Optional(t.Date()),
});

const body = t.Omit(UserType, ['id', 'createdAt', 'updatedAt']);

// const UserModel = new Elysia({ name: 'Model.User' })
//     .model({
//         'User': UserType,
//     });

const selectOnly = ['id', 'firstName', 'lastName', 'email', 'createdAt', 'updatedAt'];

const UserController = new Elysia({ name: 'Controller.User', prefix: 'users' })
    // .use(UserModel)
    .model({ User: UserType })
    .derive({ as: 'scoped' }, ({ cookie: { session } }) => ({ userService: new Repository('User') }))
    .use(globalTypes)
    .get("/", ({ userService, query }) => userService.paginate({ ...query, selectOnly }))
    .get("/:id", ({ userService, params }) => userService.findById(params.id))
    .post("/", ({ userService, body }) => userService.create(body), { body: 'User' })
    .patch("/:id", ({ userService, params, body }) => userService.update(params.id, body), { body })
    .delete("/:id", ({ userService, params }) => userService.destroy(params.id));


export default UserController;
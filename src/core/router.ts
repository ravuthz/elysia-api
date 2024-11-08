import Elysia from "elysia";

export default class Router {
    static elysia: Elysia;
    static controllers = new Map();

    static app = () => {
        if (!this.elysia) {
            this.elysia = new Elysia();
        }
        return this.elysia;
    };

    static resolveAction([controller, action]: Array<any>, context: any = null) {
        if (!this.controllers.has(controller)) {
            this.controllers.set(controller, new controller());
        }
        return this.controllers.get(controller)[action](context);
    }

    static get(path: string, actions: Array<any>) {
        return this.app().get(path, (context) => this.resolveAction(actions, context));
    }

    static post(path: string, actions: Array<any>) {
        return this.app().post(path, (context) => this.resolveAction(actions, context));
    }

    static patch(path: string, actions: Array<any>) {
        return this.app().patch(path, (context) => this.resolveAction(actions, context));
    }

    static delete(path: string, actions: Array<any>) {
        return this.app().delete(path, (context) => this.resolveAction(actions, context));
    }

    static resource(path: string, controllerClass: any) {
        const controller = new controllerClass();

        const crud = new Elysia({ name: path, prefix: path })
            .get('/', (context) => controller.index(context))
            .get('/:id', (context) => controller.show(context))
            .post('/', (context) => controller.create(context))
            .patch('/:id', (context) => controller.update(context))
            .delete('/:id', (context) => controller.delete(context));

        return this.app().use(crud);
    }

    static build(options = {}) {
        return new Elysia({
            name: 'Router',
            prefix: '/api',
            serve: {
                maxRequestBodySize: 1024 * 1024 * 512 // 512MB
            },
            ...options
        }).use(this.app());
    }

}
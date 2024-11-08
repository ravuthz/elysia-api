
import Repository from "@/services/repository";

export class UserController {
    protected service;

    public constructor() {
        this.service = new Repository('User');
    }

    public index({ query }: ContextType) {
        query.selectOnly = ['id', 'firstName', 'lastName', 'email', 'createdAt', 'updatedAt'];
        return this.service.paginate(query);
    }

    public show({ params }: ContextType) {
        console.log(params);
        return this.service.findById(params.id);
    }

    public create({ body }: ContextType) {
        return this.service.create(body);
    }

    public update({ params, body }: ContextType) {
        return this.service.update(params.id, body);
    }

    public delete({ params }: ContextType) {
        return this.service.destroy(params.id);
    }
}
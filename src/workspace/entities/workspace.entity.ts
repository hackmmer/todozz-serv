import { merge } from "lodash";
import { ITodo } from "src/todo/entities/todo.entity";


export interface IWorkspace {
    _id: string;
    token: string;
    title: string;
    todos: ITodo[];
}


export class Workspace implements IWorkspace {
    _id: string;
    token: string;
    title: string;
    todos: ITodo[];

    constructor(options?: any) {
        merge(this, this._getDefaults(), options)
    }

    private _getDefaults(): IWorkspace {
        return {
            _id: '',
            token: '',
            title: '',
            todos: [],
        };
    }
}

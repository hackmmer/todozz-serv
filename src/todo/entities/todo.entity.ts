import { merge } from "lodash";

export interface ITodo {
    _id: string;
    title: string;
    description?: string;
    token?: string;
    checkers: ITask[]
}

export interface ITask {
    text: string;
    value: boolean;
    token?: string;
}

export class Todo implements ITodo {
    _id: string;
    title: string;
    description?: string;
    token?: string;
    checkers: ITask[];


    constructor(options?: any) {
        merge(this, this._getDefaults(), options)
    }

    private _getDefaults(): ITodo {
    return {
        _id: '',
        title: '',
        token: '',
        description: '',
        checkers: [],
    };
}
}

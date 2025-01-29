import { merge } from "lodash";

export interface IUser {
    _id: string;
    profile_image?: string;
    name: string;
    password: string;
    workspaces: string[]
}

export class User {
    _id: string;
    profile_image?: string;
    name: string;
    password: string;
    workspaces: string[]

    constructor(options?: any) {
        merge(this, this._getDefaults(), options)
    }

    private _getDefaults(): IUser {
        return {
            _id: '',
            profile_image: '',
            name: '',
            password: '',
            workspaces: [],
        };
    }
}

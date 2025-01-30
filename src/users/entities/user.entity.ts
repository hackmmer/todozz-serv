import { merge } from 'lodash';
import { IWorkspace, Workspace } from 'src/workspace/entities/workspace.entity';

export interface IUser {
  _id: string;
  profile_image?: string;
  name: string;
  username: string;
  password: string;
  workspaces: IWorkspace[];
}

export class User implements IUser {
  _id: string;
  profile_image?: string;
  name: string;
  username: string;
  password: string;
  workspaces: Workspace[];

  constructor(options?: any) {
    merge(this, this._getDefaults(), options);
  }

  private _getDefaults(): IUser {
    return {
      _id: '',
      profile_image: '',
      name: '',
      username: '',
      password: '',
      workspaces: [],
    };
  }
}

import { merge } from 'lodash';
import mongoose from 'mongoose';
import { IWorkspace, Workspace } from 'src/workspace/entities/workspace.entity';

export interface IUser {
  _id?: string | mongoose.Types.ObjectId;
  profile_image?: string;
  name: string;
  username: string;
  password?: string;
  workspaces: IWorkspace[];
  sessions?: string[];
}

export interface ISession {
  _id?: string | mongoose.Types.ObjectId;
  key: string;
  user?: IUser;
}

export class User implements IUser {
  _id?: string;
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
      profile_image: '',
      name: '',
      username: '',
      password: '',
      workspaces: [],
      sessions: [],
    };
  }
}

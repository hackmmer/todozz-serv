import { merge } from 'lodash';
import mongoose from 'mongoose';

export interface ITodo {
  _id?: string | mongoose.Types.ObjectId;
  title: string;
  description?: string;
  token?: string;
  checkers: ITask[];
}

export interface ITask {
  _id?: string | mongoose.Types.ObjectId;
  text: string;
  value: boolean;
  token?: string;
}

export class Todo implements ITodo {
  _id?: string;
  title: string;
  description?: string;
  token?: string;
  checkers: ITask[];

  constructor(options?: any) {
    merge(this, this._getDefaults(), options);
  }

  private _getDefaults(): ITodo {
    return {
      title: '',
      token: '',
      description: '',
      checkers: [],
    };
  }
}

export class Task implements ITask {
  _id?: string;
  text: string;
  value: boolean;
  token?: string;

  constructor(options?: any) {
    merge(this, this._getDefaults(), options);
  }

  private _getDefaults(): ITask {
    return {
      text: '',
      value: false,
      token: '',
    };
  }
}

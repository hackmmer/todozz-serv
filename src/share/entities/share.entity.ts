import { IUser } from 'src/users/entities/user.entity';

export interface IShare {
  user: IUser | string;
  token: string;
  workspace: IUser | string;
}

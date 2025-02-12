import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { IUser } from 'src/users/entities/user.entity';
import { Helpers } from 'src/utils/helpers/helpers';
import { IWorkspace } from 'src/workspace/entities/workspace.entity';
import { Share } from './schemas/share.schema';
import { IShare } from './entities/share.entity';

@Injectable()
export class ShareService {
  constructor(@InjectModel(Share.name) private shareModel: Model<Share>) {}

  async getRef(tk: string) {
    const r = (
      await this.shareModel.findOne({
        token: tk,
      })
    )?.toJSON<IShare>();
    return r?.workspace ?? {};
  }

  async createLink(user: IUser, wk: IWorkspace) {
    const tk = Helpers.generateShareToken();
    const entry = {
      user: new mongoose.Types.ObjectId(user._id),
      token: tk,
      workspace: new mongoose.Types.ObjectId(wk._id),
    };
    await this.shareModel.create(entry);
    return entry;
  }
}

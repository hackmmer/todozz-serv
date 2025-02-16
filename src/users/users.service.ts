import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ISession, IUser } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { DbUser } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { Session } from './schemas/sessions.schema';
import { IWorkspace } from 'src/workspace/entities/workspace.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(DbUser.name) private userModel: Model<DbUser>,
    @InjectModel(Session.name) private sessionsModel: Model<Session>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return (await this.userModel.create(createUserDto)).toObject<IUser>();
  }

  async findAll() {
    return (await this.userModel.find()).map((e) => e.toObject<IUser>()).filter(e => !!e);
  }

  async findOne(options: { _id?: string; username?: string } | IUser) {
    return (
      await this.userModel.findOne({
        $or: [
          { _id: new mongoose.Types.ObjectId(options?._id) },
          { username: options?.username },
        ],
      })
    )?.toObject<IUser>() ?? {
      error: 'User not Found!',
    };
  }

  async getUser(sessionKey: string) {
    const key = sessionKey.replace('Bearer ', '');
    const session = (
      await this.sessionsModel.findOne({ key })
    )?.toObject<ISession>();
    if (!session) return {
      error: 'Session not Found!',
    };;
    const { password, ...user } = session.user;
    return await this.findOne(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // const i = this.users.findIndex((e) => e._id === id);
    // merge(this.users[i], updateUserDto);
    const u = await this.userModel.findByIdAndUpdate(id, {
      ...updateUserDto,
    }, {
      new: true
    });
    return u?.toObject() ?? {
      error: 'User not Found!',
    };
  }

  async addWorkspace(user: IUser, w: IWorkspace | string) {
    const _id = typeof w === 'string' ? new mongoose.Types.ObjectId(w) : w._id;
    const _u_id =
      typeof w === 'string' ? new mongoose.Types.ObjectId(user._id) : user._id;
    const u = await this.userModel.findOneAndUpdate(
      {
        $or: [{ _id: _u_id }, { username: user.username }],
      },
      {
        $push: {
          workspaces: _id,
        },
      },
      {
        new: true
      }
    );
    return u?.toJSON<IUser>() ?? {
      error: 'User not Found!',
    };
  }

  async hasWorkspace(user: IUser, w: IWorkspace | string) {
    const u = await this.findOne(user);
    const _w_id = typeof w === 'string' ? w : w._id;
    if ('error' in u)
      return u;
    u.workspaces.some((_w) => _w._id === _w_id);
    return true;
  }

  async addSession(user: IUser, s: ISession | string) {
    const _id = typeof s === 'string' ? new mongoose.Types.ObjectId(s) : s._id;
    const _u_id =
      typeof s === 'string' ? new mongoose.Types.ObjectId(user._id) : user._id;
    const u = await this.userModel.findOneAndUpdate(
      {
        $or: [{ _id: _u_id }, { username: user.username }],
      },
      {
        $push: {
          sessions: _id,
        },
      },
      {
        new: true
      }
    );
    return u ?? {
      error: 'User not Found!',
    };;
  }

  async remove(id: string) {
    const u = (await this.userModel.findByIdAndDelete(id))?.toObject<IUser>() ?? {
      error: 'User not Found!',
    };
    return u;
  }

  async createSession(session: ISession) {
    const r = await this.sessionsModel.create(session);
    this.addSession(session.user, r);
    return r?.toObject<ISession>() ?? {
      error: 'User not Found!',
    };;
  }

  async findSession(session: ISession) {
    return (await this.sessionsModel.findOne({
      key: session,
      user: {
        username: session.user.username,
      },
    }))?.toJSON<ISession> ?? {
      error: 'Session not Found!',
    };
  }

  async deleteSession(session: ISession) {
    const s = session.user.sessions.find((s) => s === session.key);
    if (!s) return null;
    await this.userModel.updateOne(
      {
        _id: session.user._id,
      },
      {
        $pull: {
          sessions: session.key,
        },
      },
    );
    return (await this.sessionsModel.deleteOne({
      key: s,
    })) ?? {
      error: 'Session not Found!',
    };
  }
}

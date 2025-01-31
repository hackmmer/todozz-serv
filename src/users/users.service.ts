import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ISession, IUser } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { DbUser } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { Session } from './schemas/sessions.schema';

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
    return (await this.userModel.find()).map((e) => e.toObject<IUser>());
  }

  async findOne(options: { _id?: string; username?: string }) {
    return (
      await this.userModel.findOne({
        $or: [
          { _id: new mongoose.Types.ObjectId(options?._id) },
          { username: options?.username },
        ],
      })
    ).toObject<IUser>();
  }

  async getUser(sessionKey: string) {
    const key = sessionKey.replace('Bearer ', '');
    const session = (
      await this.sessionsModel.findOne({ key })
    )?.toObject<ISession>();
    if (!session) return null;
    const { password, ...user } = session.user;
    return await this.findOne(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // const i = this.users.findIndex((e) => e._id === id);
    // merge(this.users[i], updateUserDto);
    const { workspaces, sessions, ...rest } = updateUserDto;
    const u = await this.userModel.findByIdAndUpdate(id, {
      ...rest,
      $addToSet: {
        sessions,
        workspaces,
      },
    });
    return u.toObject();
  }

  async remove(id: string) {
    const u = (await this.userModel.findByIdAndDelete(id)).toObject<IUser>();
    return u;
  }

  async createSession(session: ISession) {
    const r = await this.sessionsModel.create(session);
    this.update(session.user._id, {
      sessions: [r.toJSON<ISession>().key],
    });
    return r.toObject<ISession>();
  }

  async findSession(session: ISession) {
    return await this.sessionsModel.findOne({
      key: session,
      user: {
        username: session.user.username,
      },
    });
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
    return await this.sessionsModel.deleteOne({
      key: s,
    });
  }
}

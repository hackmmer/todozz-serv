import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ISession, IUser } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { DbUser } from './schemas/user.schema';
import { Model } from 'mongoose';
import { Session } from './schemas/sessions.schema';

@Injectable()
export class UsersService {
  // users: IUser[] = [
  //   {
  //     _id: '5631a5sd1a5s63d1a635sd1a6s5d1a6s5d1a',
  //     username: 'Blizz1800',
  //     password: 'eddyeddy',
  //     name: '',
  //     workspaces: [
  //       {
  //         _id: 'a5s64da6s5d1a6sd51as6d8a8sd48sadasd684',
  //         token: 'yiies-31as1',
  //         title: 'YiiES',
  //         todos: [],
  //       },
  //       {
  //         _id: 'asdas5d1a6s5d1asdasd5a1s6das8d4asd6a8s',
  //         token: 'pkmn-31as1',
  //         title: 'Pokemon Hungry',
  //         todos: [],
  //       },
  //     ],
  //   },
  //   {
  //     _id: '6631a5sd1a5s63d1a635sd1a6s5d1a6s5d1a',
  //     username: 'MeryTest',
  //     password: 'eddyeddy',
  //     name: 'Mery~chan',
  //     workspaces: [
  //       {
  //         _id: 'a5s64da6s5d1a6sd51as6d8a8sd48sadasd684',
  //         token: 'yiies-31as1',
  //         title: 'YiiES Job',
  //         todos: [],
  //       },
  //       {
  //         _id: 'asdasdasdasdasdasdasdasdasdasdasdasdas',
  //         token: 'asdasd-31as1',
  //         title: 'Lista de compras',
  //         todos: [],
  //       },
  //     ],
  //   },
  // ];
  // public sessions: { session: string; userId: string }[] = [
  //   {
  //     session:
  //       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkJsaXp6MTgwMCIsInN1YiI6IjU2MzFhNXNkMWE1czYzZDFhNjM1c2QxYTZzNWQxYTZzNWQxYSIsImlhdCI6MTczODIxMzAyOCwiZXhwIjoxNzM4MjE2NjI4fQ.t4ZxvvNOXrGTmmxEPxlC12Vc8FuBUz5TtZ0u7y_g3tw',
  //     userId: '5631a5sd1a5s63d1a635sd1a6s5d1a6s5d1a',
  //   },
  //   {
  //     session:
  //       'fyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkJsaXp6MTgwMCIsInN1YiI6IjU2MzFhNXNkMWE1czYzZDFhNjM1c2QxYTZzNWQxYTZzNWQxYSIsImlhdCI6MTczODIxMzAyOCwiZXhwIjoxNzM4MjE2NjI4fQ.t4ZxvvNOXrGTmmxEPxlC12Vc8FuBUz5TtZ0u7y_g3tw',
  //     userId: '6631a5sd1a5s63d1a635sd1a6s5d1a6s5d1a',
  //   },
  // ];

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

  async findOne(username: string) {
    return (
      await this.userModel.findOne({
        $or: [
          // { _id: new mongoose.Schema.ObjectId(username) },
          { username: username },
        ],
      })
    ).toObject<IUser>();
  }

  async getUser(sessionKey: string) {
    const key = sessionKey.replace('Bearer ', '');
    const session = (
      await this.sessionsModel.findOne({ key })
    ).toObject<ISession>();
    const { password, ...user } = session.user;
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // const i = this.users.findIndex((e) => e._id === id);
    // merge(this.users[i], updateUserDto);
    const { workspaces, ...rest } = updateUserDto;
    const u = (
      await this.userModel.findByIdAndUpdate(id, {
        $set: {
          ...rest,
          workspaces,
        },
      })
    ).toObject<IUser>();
    return u;
  }

  async remove(id: string) {
    const u = (await this.userModel.findByIdAndDelete(id)).toObject<IUser>();
    return u;
  }

  async createSession(session: ISession) {
    return await this.sessionsModel.create(session);
  }

  async findSession(session: ISession) {
    return await this.sessionsModel.findOne(session);
  }

  async deleteSession(session: ISession) {
    return await this.sessionsModel.deleteOne(session);
  }
}

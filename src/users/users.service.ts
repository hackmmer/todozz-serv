import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser, User } from './entities/user.entity';
import { merge } from 'lodash';

@Injectable()
export class UsersService {
  users: IUser[] = [
    {
      _id: '5631a5sd1a5s63d1a635sd1a6s5d1a6s5d1a',
      username: 'Blizz1800',
      password: 'eddyeddy',
      name: '',
      workspaces: [
        {
          _id: 'a5s64da6s5d1a6sd51as6d8a8sd48sadasd684',
          token: 'yiies-31as1',
          title: 'YiiES',
          todos: [],
        },
        {
          _id: 'asdas5d1a6s5d1asdasd5a1s6das8d4asd6a8s',
          token: 'pkmn-31as1',
          title: 'Pokemon Hungry',
          todos: [],
        },
      ],
    },
    {
      _id: '6631a5sd1a5s63d1a635sd1a6s5d1a6s5d1a',
      username: 'MeryTest',
      password: 'eddyeddy',
      name: 'Mery~chan',
      workspaces: [
        {
          _id: 'a5s64da6s5d1a6sd51as6d8a8sd48sadasd684',
          token: 'yiies-31as1',
          title: 'YiiES Job',
          todos: [],
        },
        {
          _id: 'asdasdasdasdasdasdasdasdasdasdasdasdas',
          token: 'asdasd-31as1',
          title: 'Lista de compras',
          todos: [],
        },
      ],
    },
  ];
  public sessions: { session: string; userId: string }[] = [
    {
      session:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkJsaXp6MTgwMCIsInN1YiI6IjU2MzFhNXNkMWE1czYzZDFhNjM1c2QxYTZzNWQxYTZzNWQxYSIsImlhdCI6MTczODIxMzAyOCwiZXhwIjoxNzM4MjE2NjI4fQ.t4ZxvvNOXrGTmmxEPxlC12Vc8FuBUz5TtZ0u7y_g3tw',
      userId: '5631a5sd1a5s63d1a635sd1a6s5d1a6s5d1a',
    },
    {
      session:
        'fyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkJsaXp6MTgwMCIsInN1YiI6IjU2MzFhNXNkMWE1czYzZDFhNjM1c2QxYTZzNWQxYTZzNWQxYSIsImlhdCI6MTczODIxMzAyOCwiZXhwIjoxNzM4MjE2NjI4fQ.t4ZxvvNOXrGTmmxEPxlC12Vc8FuBUz5TtZ0u7y_g3tw',
      userId: '6631a5sd1a5s63d1a635sd1a6s5d1a6s5d1a',
    },
  ];

  create(createUserDto: CreateUserDto) {
    this.users.push(new User(createUserDto));
  }

  findAll() {
    return this.users;
  }

  findOne(username: string) {
    return (
      this.users.find((e) => e.username === username) ??
      this.users.find((e) => e._id === username)
    );
  }

  getUser(sessionKey: string) {
    const key = sessionKey.replace('Bearer ', '');
    const uid = this.sessions.find((e) => key === e.session);
    const { password, ...user } = this.findOne(uid.userId);
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const i = this.users.findIndex((e) => e._id === id);
    merge(this.users[i], updateUserDto);
    return this.users[i];
  }

  remove(id: string) {
    const i = this.users.findIndex((e) => e._id === id);
    const u = this.users.slice(i, i);
    return u;
  }
}

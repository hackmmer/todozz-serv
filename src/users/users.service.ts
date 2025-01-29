import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { merge } from 'lodash';

@Injectable()
export class UsersService {

  users: User[] = [];

  create(createUserDto: CreateUserDto) {
    this.users.push(new User(createUserDto))
  }

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    return this.users.find(e => e._id === id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const i = this.users.findIndex(e => e._id === id)
    merge(this.users[i], updateUserDto)
    return this.users[i];
  }

  remove(id: string) {
    const i = this.users.findIndex(e => e._id === id)
    const u = this.users.slice(i, i);
    return u;
  }
}

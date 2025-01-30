import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const u = this.usersService.findOne(username);
    if (!u) return null;
    if (pass === u.password) {
      const { password, ...result } = u;
      return result;
    }
    return null;
  }

  async login(user: IUser | any) {
    const payload = {
      username: user.username,
      sub: user._id,
    };
    const res = {
      session: this.jwtService.sign(payload),
      user,
    };
    this.usersService.sessions.push({
      session: res.session,
      userId: res.user._id,
    });

    return res;
  }

  async logout(session: string) {
    const key = session.replace('Bearer ', '');
    const i = this.usersService.sessions.findIndex((e) => e.session === key);
    this.usersService.sessions.splice(i, 1);
    return true;
  }

  register() {}
}

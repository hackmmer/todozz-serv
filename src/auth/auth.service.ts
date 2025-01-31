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
    const u = await this.usersService.findOne({ username });
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
    await this.usersService.createSession({
      key: res.session,
      user: res.user._id,
    });

    return res;
  }

  async logout(session: string) {
    const key = session.replace('Bearer ', '');
    const user = await this.usersService.getUser(session);
    if (!user) return null;
    return await this.usersService.deleteSession({ key, user });
  }

  async register(user: IUser | any) {
    const u = await this.usersService.create(user);

    const payload = {
      username: u.username,
      sub: u._id,
    };

    const session = {
      key: this.jwtService.sign(payload),
      user,
    };

    await this.usersService.createSession({
      key: session.key,
      user: u,
    });

    return session;
  }
}

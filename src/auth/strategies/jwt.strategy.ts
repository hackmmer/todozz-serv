import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'Ly88RWRkeWVkZHkuMTgwMC5CbGl6emVyPiMhCg==',
    });
  }

  async validate(payload: any): Promise<any> {
    return {
      _id: payload.sub,
      username: payload.username,
    };
  }
}

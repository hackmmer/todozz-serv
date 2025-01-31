import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Req() req: Request) {
    const auth = req.headers.authorization;
    if (!auth) return false;
    const r = await this.authService.logout(auth);
    return { status: !!r };
  }

  @Post('register')
  async register(@Body() req) {
    return this.authService.register(req);
  }
}

import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req) {
    return this.authService.login(req.user);
  }

  @Post('logout')
  logout(@Req() req: Request) {
    return this.authService.logout(req.headers.authorization) ?? false;
  }

  // @Post('register')
  // register(@Body() registerUserDto: RegisterUserDto) {}
}

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ShareService } from './share.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IUser } from 'src/users/entities/user.entity';
import { IWorkspace } from 'src/workspace/entities/workspace.entity';

@Controller('share')
export class ShareController {
  constructor(private readonly shareService: ShareService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/:token')
  getLink(@Param('token') token: string) {
    return this.shareService.getRef(token);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createLink(@Req() req: Request, @Body() wk: IWorkspace) {
    return this.shareService.createLink(req.user as IUser, wk);
  }
}

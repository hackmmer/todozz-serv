import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IUser } from 'src/users/entities/user.entity';

@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Req() req: Request, @Body() createWorkspaceDto: CreateWorkspaceDto) {
    return this.workspaceService.create(req.user as IUser, createWorkspaceDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Req() req: Request) {
    return this.workspaceService.findAll(req.user as IUser);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.workspaceService.findOne(req.user as IUser, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspaceService.update(
      req.user as IUser,
      id,
      updateWorkspaceDto,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.workspaceService.remove(req.user as IUser, id);
  }
}

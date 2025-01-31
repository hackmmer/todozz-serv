import { UsersService } from 'src/users/users.service';
import { IUser } from 'src/users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { IWorkspace } from './entities/workspace.entity';
import { DbWorkspace } from './schemas/workspace.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DbUser } from 'src/users/schemas/user.schema';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectModel(DbWorkspace.name) private workspaceModel: Model<DbWorkspace>,
    private userService: UsersService,
  ) {}

  async create(user: IUser, createWorkspaceDto: CreateWorkspaceDto) {
    const w = (
      await this.workspaceModel.create(createWorkspaceDto)
    ).toObject<IWorkspace>();
    // user = await this.userService.findOne(user);
    // user.workspaces.push(w);
    await this.userService.update(user._id, {
      workspaces: [w],
    });
    return w;
  }

  async findAll(user: IUser) {
    return (await this.workspaceModel.find()).map((e) =>
      e.toObject<IWorkspace>(),
    );
  }

  async findOne(user: IUser, id: string) {
    return (
      await this.workspaceModel.findOne({ token: id })
    ).toObject<IWorkspace>();
  }

  async update(
    user: IUser,
    id: string,
    updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    const { todos, ...rest } = updateWorkspaceDto;
    const w = (
      await this.workspaceModel.findByIdAndUpdate(id, {
        $set: {
          ...rest,
          todos,
        },
      })
    ).toObject<IWorkspace>();
    return w;
  }

  remove(user: IUser, id: string) {
    const r = this.workspaceModel.findByIdAndDelete(id);
    return r;
  }
}

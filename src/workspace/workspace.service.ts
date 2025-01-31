import { UsersService } from 'src/users/users.service';
import { IUser } from 'src/users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { IWorkspace } from './entities/workspace.entity';
import { DbWorkspace } from './schemas/workspace.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ITodo } from 'src/todo/entities/todo.entity';

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
    await this.userService.addWorkspace(user, w);
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

  async addTodo(workspace: IWorkspace | string, todo: ITodo) {
    const tk = typeof workspace === 'string' ? workspace : workspace._id;
    const w = await this.workspaceModel
      .updateOne(
        {
          token: tk,
        },
        {
          $push: {
            todos: new mongoose.Types.ObjectId(todo._id),
          },
        },
      )
      .lean();
    return w;
  }
}

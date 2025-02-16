import { TodoService } from './../todo/todo.service';
import { UsersService } from 'src/users/users.service';
import { IUser } from 'src/users/entities/user.entity';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
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
    @Inject(forwardRef(() => TodoService))
    private todoService: TodoService,
  ) { }

  async create(user: IUser, createWorkspaceDto: CreateWorkspaceDto) {
    const w = (
      await this.workspaceModel.create(createWorkspaceDto)
    )?.toObject<IWorkspace>() ?? {
      error: 'User not Found!',
    };
    if ('error' in w)
      return w;
    await this.userService.addWorkspace(user, w);
    return w;
  }

  async findAll(user: IUser) {
    return (await this.workspaceModel.find()).map((e) =>
      e?.toObject<IWorkspace>(),
    ).filter(e => !!e);
  }

  async findOne(user: IUser, token: string) {
    return (
      await this.workspaceModel.findOne({ token: token })
    )?.toObject<IWorkspace>() ?? {
      error: 'Workspace not Found!',
    };
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
    )?.toObject<IWorkspace>() ?? {
      error: 'Workspace not Found!',
    };
    return w;
  }

  async remove(user: IUser, token: string) {
    // const _w_id = typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id;

    const w = // await this.workspaceModel.findOneAndDelete({ _id: _w_id })
      (await this.workspaceModel.findOne({ token }))?.toJSON<IWorkspace>() ?? {
        error: 'Workspace not Found!',
      };

    if ('error' in w) return w;
    if (!this.userService.hasWorkspace(user, w)) return {
      error: `Workspace not Found in user ${user.username}!`,
    }; // error

    await this.workspaceModel.deleteOne({
      token,
    });

    w.todos.forEach(async (_t) => {
      await this.todoService.remove(_t.token);
    });

    return w;
  }

  async addTodo(workspace: IWorkspace | string, todo: ITodo) {
    const tk = typeof workspace === 'string' ? workspace : workspace._id;
    const w = (await this.workspaceModel
      .updateOne(
        {
          token: tk,
        },
        {
          $push: {
            todos: new mongoose.Types.ObjectId(todo._id),
          },
        },
      ))
    return w ?? {
      error: 'Workspace not Found!',
    };
  }
}

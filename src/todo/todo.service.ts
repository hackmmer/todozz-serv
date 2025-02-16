import { IUser } from './../users/entities/user.entity';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ITodo, ITask } from './entities/todo.entity';
import mongoose, { Model } from 'mongoose';
import { DbTodo } from './schemas/todo.schema';
import { DbTask } from './schemas/task.shcema';
import { WorkspaceService } from 'src/workspace/workspace.service';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(DbTodo.name) private todoModel: Model<DbTodo>,
    @InjectModel(DbTask.name) private taskModel: Model<DbTask>,
    @Inject(forwardRef(() => WorkspaceService))
    private workspaceService: WorkspaceService,
  ) { }

  async create(user: IUser, createTodoDto: CreateTodoDto) {
    const { workspace, ...todo } = createTodoDto;
    if (
      !(await this.workspaceService.findOne(
        user,
        typeof workspace === 'string' ? workspace : workspace.token,
      ))
    ) {
      return {
        error: 'Workspace not Found!',
      }; // error
    }
    const r = (
      await this.todoModel.create({
        title: todo.title,
        token: todo.token,
        description: todo.description,
      })
    ).toObject<ITodo>();

    todo.checkers.forEach(async (t) => {
      const task = await this.createTask(t);
      await this.addTask(r, task);
    });
    r.checkers = todo.checkers;
    await this.workspaceService.addTodo(workspace, r);
    return r;
  }

  async createTask(task: ITask) {
    return (await this.taskModel.create(task)).toObject<ITask>();
  }

  async updateTask(token: string, updateTaskDto: UpdateTaskDto) {
    return (
      await this.taskModel.findOneAndUpdate(
        { token },
        {
          ...updateTaskDto,
        },
        { new: true },
      )
    )?.toObject() ?? {
      error: `Task not Found with token ${token}!`,
    };
  }

  async addTask(todo: ITodo, task: ITask) {
    const _id =
      typeof todo._id === 'string'
        ? new mongoose.Types.ObjectId(todo._id)
        : todo._id;
    const r = this.todoModel.findOneAndUpdate(
      {
        $or: [{ _id }, { token: todo.token }],
      },
      {
        $push: {
          checkers: task,
        },
      },
      {
        new: true,
      },
    );
    return (await r)?.toObject() ?? {
      error: 'Todo not Found!',
    };
  }

  findAll() {
    // return this.todos;
  }

  findOne(id: string) {
    // return this.todos.find((e) => e._id === id);
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    const { checkers, ...rest } = updateTodoDto
    const t = (await this.todoModel.findOneAndUpdate({
      token: id
    }, {
      $set: {
        ...rest,
      }
    }, {
      new: true
    })).toJSON<ITodo>();

    checkers.forEach(async (task) => {
      console.log(await this.updateTask(task.token, task))
      console.log(await this.addTask(t, task))
    })

    return t ?? {
      error: `Todo not Found with token ${id}!`,
    };
  }

  async remove(t: ITodo | string) {
    const _token = typeof t === 'string' ? t : t.token;
    const todo = (
      await this.todoModel.findOneAndDelete({
        token: _token,
      })
    )?.toJSON<ITodo>() ?? {
      error: 'Todo not Found!',
    };

    if ('error' in todo) return todo;

    todo.checkers.forEach(async (task) => {
      await this.taskModel.deleteOne({
        token: task.token,
      });
    });

    return todo;
  }
}

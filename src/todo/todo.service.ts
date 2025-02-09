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
  ) {}

  async create(user: IUser, createTodoDto: CreateTodoDto) {
    const { workspace, ...todo } = createTodoDto;
    if (
      !(await this.workspaceService.findOne(
        user,
        typeof workspace === 'string' ? workspace : workspace.token,
      ))
    ) {
      return {}; // error
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
    return (await this.taskModel.create(task)).toObject();
  }

  async updateTask(token: string, updateTaskDto: UpdateTaskDto) {
    return (
      await this.taskModel.findOneAndUpdate(
        { token },
        { ...updateTaskDto },
        { new: true },
      )
    ).toObject();
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
    return (await r).toObject();
  }

  findAll() {
    // return this.todos;
  }

  findOne(id: string) {
    // return this.todos.find((e) => e._id === id);
  }

  update(id: string, updateTodoDto: UpdateTodoDto) {
    // const i = this.todos.findIndex((e) => e._id === id);
    // merge(this.todos[i], updateTodoDto);
    // return this.todos[i];
  }

  async remove(t: ITodo | string) {
    const _token = typeof t === 'string' ? t : t.token;
    const todo = (
      await this.todoModel.findOneAndDelete({
        token: _token,
      })
    ).toJSON<ITodo>();

    todo.checkers.forEach(async (task) => {
      await this.taskModel.deleteOne({
        token: task.token,
      });
    });

    return todo;
  }
}

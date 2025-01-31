import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Todo, ITodo, Task, ITask } from './entities/todo.entity';
import mongoose, { Model, Schema } from 'mongoose';
import { DbTodo } from './schemas/todo.schema';
import { DbTask } from './schemas/task.shcema';
import { WorkspaceService } from 'src/workspace/workspace.service';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(DbTodo.name) private todoModel: Model<DbTodo>,
    @InjectModel(DbTask.name) private taskModel: Model<DbTask>,
    private workspaceService: WorkspaceService,
  ) {}

  async create(createTodoDto: CreateTodoDto) {
    const { workspace, ...todo } = createTodoDto;
    const r = (
      await this.todoModel.create({
        title: todo.title,
        token: todo.token,
        description: todo.description,
      })
    ).toObject<ITodo>();
    todo.checkers.forEach(async (t) => {
      const task = await this.createTask(t);
      this.addTask(r, task);
      r.checkers.push(task);
      return task;
    });
    await this.workspaceService.addTodo(workspace, r);
    return r;
  }

  async createTask(task: ITask) {
    return (await this.taskModel.create(task)).toObject();
  }

  async addTask(todo: ITodo, task: ITask) {
    const _id =
      typeof todo._id === 'string'
        ? new mongoose.Schema.Types.ObjectId(todo._id)
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

  remove(id: string) {
    // const i = this.todos.findIndex((e) => e._id === id);
    // const u = this.todos.slice(i, i);
    // return u;
  }
}

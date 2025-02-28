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
      (
        await this.taskModel.findOneAndUpdate(
          { token },
          {
            ...updateTaskDto,
          },
          { new: true },
        )
      )?.toObject() ?? {
        error: `Task not Found with token ${token}!`,
      }
    );
  }

  async addTask(todo: ITodo, task: ITask) {
    const _id =
      typeof todo._id === 'string'
        ? new mongoose.Types.ObjectId(todo._id)
        : todo._id;
    const r = await this.todoModel.findOneAndUpdate(
      { $or: [{ _id }, { token: todo.token }] },
      {
        $addToSet: {
          // Evita duplicados basado en el _id de la tarea
          checkers: {
            $each: [task],
          },
        },
      },
      { new: true },
    );
    return r?.toObject() ?? { error: 'Todo not Found!' };
  }

  findAll() {
    // return this.todos;
  }

  async findOneTask(id: string) {
    // return this.todos.find((e) => e._id === id);
    return (
      await this.taskModel.findOne({
        token: id,
      })
    )?.toJSON<ITask>();
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    const { checkers = [], ...rest } = updateTodoDto; // Asegurar array vacío por defecto
    let updatedTodo: ITodo;

    try {
      // 1. Actualizar campos básicos del Todo
      updatedTodo = (
        await this.todoModel.findOneAndUpdate(
          { token: id },
          { $set: { ...rest } },
          { new: true },
        )
      )?.toJSON<ITodo>();

      if (!updatedTodo) {
        throw new Error(`Todo not found with token ${id}`);
      }

      // Capturar tokens existentes y nuevos
      const existingTokens = updatedTodo.checkers.map((t) => t.token);
      const newTokens = checkers.map((t) => t.token);
      const tokensToDelete = existingTokens.filter(
        (token) => !newTokens.includes(token),
      );

      // 2. Procesar checkers (crear/actualizar)
      const taskOperations = checkers.map(async (task) => {
        let taskResult: ITask;
        const taskExists = await this.findOneTask(task.token);

        // Actualizar tarea existente
        if (!!taskExists) {
          const existingTask = await this.updateTask(task.token, task);
          if ('error' in existingTask) {
            throw new Error(`Failed to update task: ${existingTask.error}`);
          }
          taskResult = existingTask;
        }
        // Crear nueva tarea
        else {
          taskResult = await this.createTask(task);
        }

        await this.addTask(updatedTodo, taskResult);
        return taskResult;
      });

      const processedTasks = await Promise.all(taskOperations);

      // 3. Actualizar la lista de checkers del Todo con las tareas procesadas
      await this.todoModel.findOneAndUpdate(
        { token: id },
        { $set: { checkers: processedTasks } },
        { new: true },
      );

      // 4. Eliminar tareas que ya no están en la lista
      if (tokensToDelete.length > 0) {
        await this.taskModel.deleteMany({ token: { $in: tokensToDelete } });
      }

      // Actualizar la referencia local de checkers
      updatedTodo.checkers = processedTasks;
    } catch (error) {
      // Manejo centralizado de errores
      return {
        error: error.message || 'Failed to update todo',
        details: error.stack,
      };
    }

    return updatedTodo;
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

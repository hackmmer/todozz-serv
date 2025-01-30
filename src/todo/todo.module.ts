import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DbTodo, TodoSchema } from './schemas/todo.schema';
import { DbTask, TaskSchema } from './schemas/task.shcema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DbTodo.name, schema: TodoSchema },
      { name: DbTask.name, schema: TaskSchema },
    ]),
  ],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}

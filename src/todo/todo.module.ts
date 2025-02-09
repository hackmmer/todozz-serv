import { forwardRef, Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DbTodo, TodoSchema } from './schemas/todo.schema';
import { DbTask, TaskSchema } from './schemas/task.shcema';
import { WorkspaceModule } from 'src/workspace/workspace.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DbTodo.name, schema: TodoSchema },
      { name: DbTask.name, schema: TaskSchema },
    ]),
    forwardRef(() => WorkspaceModule), // Use forwardRef
  ],
  controllers: [TodoController],
  providers: [TodoService],
  exports: [TodoService],
})
export class TodoModule {}

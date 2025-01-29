import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TodoModule } from './todo/todo.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { RouterModule, Routes } from '@nestjs/core';

const routes: Routes = [
  {
    path: 'api/user',
    module: UsersModule,
  },
  {
    path: 'api/todo',
    module: TodoModule,
  },
  {
    path: 'api/workspace',
    module: WorkspaceModule,
  }
]

@Module({
  imports: [UsersModule, TodoModule, WorkspaceModule, RouterModule.register(routes)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

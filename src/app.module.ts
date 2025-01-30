import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TodoModule } from './todo/todo.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { RouterModule, Routes } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';

const routes: Routes = [
  {
    path: 'api/',
    module: UsersModule,
  },
  {
    path: 'api/',
    module: TodoModule,
  },
  {
    path: 'api/',
    module: WorkspaceModule,
  },
  {
    path: 'api/',
    module: AuthModule,
  },
];

@Module({
  imports: [
    UsersModule,
    TodoModule,
    WorkspaceModule,
    RouterModule.register(routes),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

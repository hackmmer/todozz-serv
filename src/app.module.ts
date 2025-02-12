import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TodoModule } from './todo/todo.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { RouterModule, Routes } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';

import { environment } from './environments/environment';
import { ShareModule } from './share/share.module';

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
  {
    path: 'api/',
    module: ShareModule,
  },
];

@Module({
  imports: [
    UsersModule,
    TodoModule,
    WorkspaceModule,
    ShareModule,
    RouterModule.register(routes),
    MongooseModule.forRoot(
      environment.database.url,
      environment.database.options,
    ),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
